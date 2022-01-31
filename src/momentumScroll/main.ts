/*         momentumScroll/main.ts          */
/*  source of the momentumScroll function  */

import { getFromOffsetArray, pushToOffsetArray, removeFromOffsetArray, selectNode, setOffsetArray, bezierEasing, parseBezierString, isCompatible } from "../utils";
import { defaults, defaultSpeeds } from "./defaults";
import { momentumScrollStruct } from "./struct";


var fixedOffsets: any = [];
var offsets: any = [];


export function momentumScroll(dataObj: momentumScrollStruct) {

    // Assign defaults to dataObj object
    dataObj = (<any>Object).assign({}, defaults, dataObj);

    let pl: { x: number, y: number }; 
    let startStamp: number;

    let rootElem = selectNode(dataObj.root);

    // Set any offsets or fixedOffsets assigned on initialization
    setOffsetArray(fixedOffsets, rootElem, dataObj.fixedOffsets);
    setOffsetArray(offsets, rootElem, dataObj.offsets);

    // if client is a phone or unsupported (supported browsers in README)
    if (!isCompatible()) {
        let activeFixedOffsets = getFromOffsetArray(fixedOffsets, rootElem);

        rootElem.addEventListener("scroll", (event: any) => {
            let activeOffsets = getFromOffsetArray(offsets, rootElem);

            // Offset elements scrolling
            if (activeOffsets) {
                activeOffsets.forEach((e: any) => {
                    e = Object.assign({}, defaultSpeeds, e);

                    let offset = `translate(${event.target.scrollLeft * (1 - e.speedX)}px, ${event.target.scrollTop * (1 - e.speedY)}px)`;
                    let nodes = selectNode(e.element, true);

                    if (Symbol.iterator in Object(nodes)) {
                        // If multiple nodes are selected
                        for (let e of nodes as any) {
                            e.style.webkitTransform = offset;
                            e.style.transform = offset;
                        }
                    } else {
                        // If single node is selected
                        nodes.style.webkitTransform = offset;
                        nodes.style.transform = offset;
                    }
                });
            }
        });

        // Fixed elements
        if (activeFixedOffsets) {
            activeFixedOffsets.forEach((element: any) => {
                let nodes = selectNode(element, true);

                if (Symbol.iterator in Object(nodes)) {
                    // If multiple nodes are selected
                    for (let e of nodes as any) {
                        e.style.position = "fixed";
                    }
                } else {
                    // If single node is selected
                    nodes.style.position = "fixed";
                }
            });
        }

        return {
            destroy: onDestroy,
            removeOffset: removeOffset,
            addOffset: addOffset,
            addFixedOffset: addFixedOffset
        }
    }



    let fixedElem = DOMRestructure(rootElem);
    let matrix = new WebKitCSSMatrix(window.getComputedStyle(fixedElem.fixed).transform);
    let lastLocation = { x: matrix.m41, y: matrix.m42 }

    // Detect any changes to root element's appearance
    let mutationObserver = new MutationObserver(onResize);
    mutationObserver.observe(rootElem, {
        childList: true,
        attributes: true,
        subtree: true
    });
    window.addEventListener("resize", onResize);

    // Scroll handler
    rootElem.addEventListener("scroll", onScroll);

    return {
        destroy: onDestroy,
        removeOffset: removeOffset,
        addOffset: addOffset,
        addFixedOffset: addFixedOffset
    }





    /* Event Handler Functions */

    // Scroll handler
    function onScroll(e: any) {

        let activeOffsets = getFromOffsetArray(offsets, rootElem);
        let activeFixedOffsets = getFromOffsetArray(fixedOffsets, rootElem);

        // Get scroll location of rootElement
        
        pl = { x: rootElem.scrollLeft, y: rootElem.scrollTop };
        if (typeof pl.x === "undefined" || typeof pl.y === "undefined")
            pl = { x: rootElem.scrollX, y: rootElem.scrollY, };

        // Current time for timing to work
        startStamp = Date.now();

        // Scroll Animation Frame Handler for easing
        easeFrames(lastLocation, pl, startStamp, (position: { x: number, y: number }) => {
            
            let translateString = `translate(${position.x}px, ${position.y}px)`;
            fixedElem.fixed.style.webkitTransform = translateString;
            fixedElem.fixed.style.transform = translateString;

            lastLocation = position;
            
            // Offset elements scrolling if there are any present
            if (Array.isArray(activeOffsets)) {

                for (let i = 0; i < activeOffsets.length; i++) {

                    let e = Object.assign({}, defaultSpeeds, activeOffsets[i]);
                    let offset = `translate(${position.x * (e.speedX - 1)}px, ${position.y * (e.speedY - 1)}px)`;
                    let elements: any = selectNode(e.element, true);

                    if (NodeList.prototype.isPrototypeOf(elements)) {
                        for (let e of elements as any) {
                            e.style.webkitTransform = offset;
                            e.style.transform = offset;
                        }
                    } else {
                        elements.style.webkitTransform = offset;
                        elements.style.transform = offset;
                    }
                }
            }

            // set fixedOffsets as fixed
            if (Array.isArray(activeFixedOffsets)) {

                for (let i = 0; i < activeFixedOffsets.length; i++) {
                    let offset = `translate(${-position.x}px, ${-position.y}px)`;
                    let node = selectNode(activeFixedOffsets[i], true);

                    if (NodeList.prototype.isPrototypeOf(node)) {
                        for (let e of node as any) {
                            e.style.webkitTransform = offset;
                            e.style.transform = offset;
                        }
                    } else {
                        node.style.webkitTransform = offset;
                        node.style.transform = offset;
                    }
                }
            }
        });

        if (dataObj.onScroll) asyncScrollFunction(e);
    }

    // Run dataObj.onScroll function asynchrounously
    function asyncScrollFunction(e: any) {
        return new Promise(r => {
            dataObj.onScroll(e);
            r(true);
        })
    }

    // Returns calculated transform values based on scroll position
    function easeFrames(
        tl: { x: number, y: number },
        pl: { x: number, y: number },
        startStamp: number,
        onIterate: (position: { x: number, y: number }) => void
    ) {

        // Parse bezier easing string into number values
        let easing = parseBezierString(dataObj.easing);

        let diffX = ((tl.x * -1) - pl.x);
        let diffY = ((tl.y * -1) - pl.y);
        let x: number, y: number;

        // Animation frame loop
        (function loop() {

            let t = (Date.now() - startStamp) / dataObj.duration!;

            if (t > 1) t = 1.01;
            if (t < 1) {
                x = (diffX * bezierEasing.apply(null, easing)(t)) + tl.x;
                y = (diffY * bezierEasing.apply(null, easing)(t)) + tl.y;

                x = Math.ceil(x * 100) / 100;
                y = Math.ceil(y * 100) / 100;

                new Promise(r => {
                    onIterate({ x: x, y: y });
                    r(true);
                });

                window.requestAnimationFrame(loop);
            }
        }());
    }













    // Remove all slickScroll handers and return DOM to original state
    function onDestroy() {
        let activeOffsets = getFromOffsetArray(offsets, rootElem);
        let activeFixedOffsets = getFromOffsetArray(fixedOffsets, rootElem);
        let wrapper: any = rootElem.querySelector("._SS_wrapper");

        // Remove all Observers and EventListeners
        rootElem.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        mutationObserver.disconnect();

        // Revert root element to original state and remove all slickscroll classes
        for (let i = wrapper.children.length; i > 0; i--) {
            if (wrapper.children[i - 1].removeProperty) wrapper.children[i - 1].removeProperty("transform");
            rootElem.insertBefore(wrapper.children[i - 1], rootElem.children[0]);
        }
        wrapper.remove();

        selectNode(dataObj.root).querySelector("._SS_dummy")!.remove();
        rootElem.style.removeProperty("overflow");
        rootElem.style.removeProperty("position");

        // Clear all transformations on offsets
        clearTransform(activeOffsets);
        clearTransform(activeFixedOffsets);

        // Purge instance from fixedOffsets and offsets arrays
        let index;
        index = (fixedOffsets as any[]).findIndex(obj => obj.element == selectNode(dataObj.root));
        fixedOffsets.splice(index, 1);
        index = (offsets as any[]).findIndex(obj => obj.element == selectNode(dataObj.root));
        offsets.splice(index, 1);

        // Remove "transform" from an offset array
        function clearTransform(array: any[]) {
            if (array) {
                array.forEach((e) => {
                    let elements = selectNode(e.element, true);
                    if (!e.element) elements = selectNode(e, true);

                    if (NodeList.prototype.isPrototypeOf(elements)) {
                        for (e of elements as any) {
                            e.style.removeProperty("transform");
                            e.style.removeProperty("-webkit-transform");
                        }
                        return;
                    }

                    elements.style.removeProperty("transform");
                    elements.style.removeProperty("-webkit-transform");
                });
            }
        }
    }



    // Add Offsets after intialization
    function addOffset(obj: {
        element: string | HTMLElement | HTMLBodyElement | null,
        speedY?: number,
        speedX?: number
    }) {

        let activeOffsets = getFromOffsetArray(offsets, rootElem);

        if (typeof obj !== "object") return;

        // Check if offset already exists
        const find = activeOffsets.find((i: any) => i.element == obj.element);
        if (find || !obj.element) return;

        // Assign an offset and push it to offsets array
        obj = Object.assign({}, defaultSpeeds, obj);
        pushToOffsetArray(offsets, rootElem, obj);
    }



    // Add fixedOffsets after intialization
    function addFixedOffset(element: string | HTMLElement | HTMLBodyElement | null) {
        let activeFixedOffsets = getFromOffsetArray(fixedOffsets, rootElem);

        if (!selectNode(element, true) || activeFixedOffsets.includes(element))
            return;

        pushToOffsetArray(fixedOffsets, rootElem, element);
    }



    // Disable and remove an active Fixed or Regular Offset
    function removeOffset(element: string | HTMLElement | HTMLBodyElement | null) {

        let activeItem = getFromOffsetArray(offsets, rootElem);
        let activeFixedItem = getFromOffsetArray(fixedOffsets, rootElem);

        let offsetIndex = offsets.findIndex((e: any) => e.element == rootElem);
        let fixedIndex = fixedOffsets.findIndex((e: any) => e.element == rootElem);

        if (activeItem.length > 0) {
            offsets[offsetIndex].items = removeFromOffsetArray(activeItem, selectNode(element, true));
            offsets[offsetIndex].items = removeFromOffsetArray(activeItem, element);
        }
        if (activeFixedItem.length > 0) {
            fixedOffsets[fixedIndex].items = removeFromOffsetArray(activeFixedItem, selectNode(element, true));
            fixedOffsets[fixedIndex].items = removeFromOffsetArray(activeFixedItem, element);
        }
    }



    // Resize dummy element when window resizes to prevent overscrolling
    function onResize() {
        fixedElem.dummy.style.height = fixedElem.fixed.scrollHeight + "px";
    }


    // Adds fixed transformable child element to the root element
    function DOMRestructure(root: any) {
        // Make sure root doesnt already have a position
        if (getComputedStyle(root).position != "absolute" || getComputedStyle(root).position != "fixed") {
            root.style.position = "relative";
        }

        let child = document.createElement('div');
        let dummy = document.createElement('div');

        child.classList.add("_SS_wrapper");
        dummy.classList.add("_SS_dummy");

        for (let i = root.children.length; i > 0; i--) {
            child.insertBefore(root.children[(i - 1)], child.children[0]);
        }

        root.innerHTML = "";
        root.style.overflow = "auto";
        root.appendChild(child);
        root.appendChild(dummy);

        // Dummy Scroll element to allow overflow to appear
        dummy.style.height = child.scrollHeight + "px";
        dummy.style.width = child.scrollWidth + "px";
        dummy.style.top = "0px";
        dummy.style.left = "0px";
        dummy.style.position = "absolute";
        dummy.style.zIndex = "-9999";

        // Content inside the root element
        child.style.zIndex = "1";
        child.style.height = "100%";
        child.style.width = "100%";
        child.style.overflow = "visible";
        child.style.top = "0px";
        child.style.left = "0px";
        child.style.position = "sticky";

        return {
            fixed: root.querySelector("div._SS_wrapper"),
            dummy: root.querySelector("div._SS_dummy")
        };
    }
}