/*         momentumScroll/main.ts          */
/*  source of the momentumScroll function  */

import { getFromOffsetArray, pushToOffsetArray, removeFromOffsetArray, selectNode, setOffsetArray, bezierEasing, parseBezierString } from "../utils";
import { defaults, defaultSpeeds, pennerEasings } from "./defaults";
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

    // if client is phone or unsupported
    if (!isCompatible()) {
        let activeFixedOffsets = getFromOffsetArray(fixedOffsets, rootElem);

        rootElem.addEventListener("scroll", (event: any) => {
            let activeOffsets = getFromOffsetArray(offsets, rootElem);

            // Offset elements scrolling
            if (activeOffsets) {

                activeOffsets.forEach((e: any) => {
                    e = Object.assign({}, defaultSpeeds, e);

                    let offset = `translate(${event.target.scrollLeft * (1 - e.speedX)}px, ${event.target.scrollTop * (1 - e.speedY)}px)`;
                    let elements: NodeListOf<any> = selectNode(e.element, true);

                    for (e of elements as any) {
                        e.style.webkitTransform = offset;
                        e.style.transform = offset;
                    }
                });
            }
        });

        // Fixed elements
        if (activeFixedOffsets) {
            activeFixedOffsets.forEach((e: any) => {
                let elements: NodeListOf<any> = selectNode(e, true);
                for (e of elements as any) {
                    e.style.position = "fixed";
                }
            });
        }

        return {
            // TODO: Add mobile on Destroy
            destroy: onDestroy,
            removeOffset: removeOffset,
            addOffset: addOffset,
            addFixedOffset: addFixedOffset
        }
    }



    // if not phone or unsupported then then ->

    let fixedElem = DOMRestructure(rootElem);
    let mutationObserver = new MutationObserver(onResize);
    // Detect any changes to root element's appearance
    window.addEventListener("resize", onResize);
    mutationObserver.observe(rootElem, {
        childList: true,
        attributes: true,
        subtree: true
    })

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

        if (dataObj.onScroll) dataObj.onScroll(e); // Run passed onScroll function

        let activeOffsets = getFromOffsetArray(offsets, rootElem);
        let activeFixedOffsets = getFromOffsetArray(fixedOffsets, rootElem);

        // Get scroll location of rootElement
        pl = { x: rootElem.scrollLeft, y: rootElem.scrollTop };
        if (typeof pl.x === "undefined" || typeof pl.y === "undefined")
            pl = { x: rootElem.scrollX, y: rootElem.scrollY, };

        // Get transform coordinates of fixedElements
        let style = window.getComputedStyle(fixedElem.fixed);
        let matrix = new WebKitCSSMatrix(style.transform);
        let tl = { x: matrix.m41, y: matrix.m42 }

        // Current time for timing to work
        startStamp = Date.now();



        // Scroll Animation Frame Handler for easing
        easeFrames(tl, pl, startStamp, (position: { x: number, y: number }) => {

            let translateString = `translate(${position.x}px, ${position.y}px)`;
            fixedElem.fixed.style.webkitTransform = translateString;
            fixedElem.fixed.style.transform = translateString;

            // Offset elements scrolling if there are any present
            if (Array.isArray(activeOffsets)) {

                for (let i = 0; i < activeOffsets.length; i++) {
                    let e = activeOffsets[i];

                    e = Object.assign({}, defaultSpeeds, e);
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
                    let offset = `translate(${position.x * -1}px, ${position.y * -1}px)`;
                    let elements = selectNode(activeFixedOffsets[i], true);

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
        });



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
            let x, y;

            // Animation frame loop
            (function loop() {

                let t = (Date.now() - startStamp) / dataObj.duration!;

                if (t > 1) t = 1.01;
                if (t < 1) {
                    x = (diffX * bezierEasing.apply(null, easing)(t)) + tl.x;
                    y = (diffY * bezierEasing.apply(null, easing)(t)) + tl.y;

                    x = Math.ceil(x * 100) / 100;
                    y = Math.ceil(y * 100) / 100;
                    onIterate({ x: x, y: y });

                    window.requestAnimationFrame(loop);
                }
            }());
        }
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



    // Checks for mobile & unsupported browsers
    function isCompatible() {
        let check = false;
        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor);
        if (!check && CSS.supports) check = !CSS.supports("position", "sticky");
        return !check;
    }
}