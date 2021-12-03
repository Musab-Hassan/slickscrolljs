/**************************************
*            SlickScrollJS
*           © Musab Hassan
*
*        For building this file, 
*      refer to gulpfile.ts or run
*             'gulp tasks'.
*
***************************************/



// MomentumScroll interface
interface momentumScrollStruct {
    root: string | HTMLElement | HTMLBodyElement | null,
    easing?: string,
    duration?: number,
    fixedOffsets?: string[] | HTMLElement[] | NodeList[] | null[],
    offsets?: [{
        element: string | HTMLElement | NodeList | null,
        speedY?: number,
        speedX?: number
    }],
    onScroll?(func: () => any): any
}





export default class slickScroll {

    // Default properties
    private defaults: { root: any, duration: number, easing: string, offsets: any[], fixedOffsets: any[] } = {
        root: "body",
        duration: 1000,
        easing: "cubic-bezier(0.15, 1, 0.4, 1)",
        offsets: [],
        fixedOffsets: []
    }

    // Default offset speeds
    private defaultSpeeds: {speedY: number, speedX: number} = {
        speedY: 1,
        speedX: 1
    }

    // Default pennerEasings
    private pennerEasing: { name: string, value: number[] }[] = [
        // Sine
        { name: "easeInSine", value: [0.12, 0, 0.39, 0] },
        { name: "easeOutSine", value: [0.61, 1, 0.88, 1] },
        { name: "easeInOutSine", value: [0.37, 0, 0.63, 1] },
        // Quad
        { name: "easeInQuad", value: [0.11, 0, 0.5, 0] },
        { name: "easeOutQuad", value: [0.5, 1, 0.89, 1] },
        { name: "easeInOutQuad", value: [0.45, 0, 0.55, 1] },
        // Cubic
        { name: "easeInCubic", value: [0.32, 0, 0.67, 0] },
        { name: "easeOutCubic", value: [0.33, 1, 0.68, 1] },
        { name: "easeInOutCubic", value: [0.65, 0, 0.35, 1] },
        // Quart
        { name: "easeInQuart", value: [0.5, 0, 0.75, 0] },
        { name: "easeOutQuart", value: [0.25, 1, 0.5, 1] },
        { name: "easeInOutQuart", value: [0.76, 0, 0.24, 1] },
        // Quint
        { name: "easeInQuint", value: [0.64, 0, 0.78, 0] },
        { name: "easeOutQuint", value: [0.22, 1, 0.36, 1] },
        { name: "easeInOutQuint", value: [0.83, 0, 0.17, 1] },
        // Expo
        { name: "easeInExpo", value: [0.7, 0, 0.84, 0] },
        { name: "easeOutExpo", value: [0.16, 1, 0.3, 1] },
        { name: "easeInOutExpo", value: [0.87, 0, 0.13, 1] },
        // Circ
        { name: "easeInCirc", value: [0.55, 0, 1, 0.45] },
        { name: "easeOutCirc", value: [0, 0.55, 0.45, 1] },
        { name: "easeInOutCirc", value: [0.85, 0, 0.15, 1] }
    ]

    // Offsets storage
    private fixed: any = [];
    private offsets: any = [];




    // mometumScrolling
    public momentumScroll(dataObj: momentumScrollStruct) {

        let THIS = this; // global class 'this' for access from inner functions
        
        // Assign defaults to dataObj object
        dataObj = (<any>Object).assign({}, this.defaults, dataObj);
        
        let pl: {x: number, y: number}, startStamp: number;
        let rootElem = selectNode(dataObj.root);

        // Set any offsets or fixedOffsets assigned on initialization
        setOffsetArray(this.fixed, rootElem, dataObj.fixedOffsets);
        setOffsetArray(this.offsets, rootElem, dataObj.offsets);

        // if client is phone or unsupported
        if (!isCompatible()) {
            let activeFixedOffsets = getFromOffsetArray(this.fixed, rootElem);

            rootElem.addEventListener("scroll", (event: any) => {
                let activeOffsets = getFromOffsetArray(this.offsets, rootElem);

                // Offset elements scrolling
                if (activeOffsets) {

                    activeOffsets.forEach((e: any) => {
                        e = Object.assign({}, this.defaultSpeeds, e);

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



        // if not phone or unsupported then this will run
        
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





        /* MomentumScroll Functions */

        // Scroll handler
        function onScroll(e: any) {

            let activeOffsets = getFromOffsetArray(THIS.offsets, rootElem);
            let activeFixedOffsets = getFromOffsetArray(THIS.fixed, rootElem);
            
            if (dataObj.onScroll) dataObj.onScroll(e); // Run slickScroll scroll event

            // Get scroll location of rootElement
            pl = { x: rootElem.scrollLeft, y: rootElem.scrollTop };
            if (typeof pl.x === "undefined" || typeof pl.y === "undefined") 
                pl = { y: rootElem.scrollY, x: rootElem.scrollX };

            // Get transform coordinates of fixedElements
            let style = window.getComputedStyle(fixedElem.fixed);
            let matrix = new WebKitCSSMatrix(style.transform);
            let tl = { x: matrix.m41, y: matrix.m42 }

            // Get current time for timing to work
            startStamp = Date.now();



            // Scroll Animation Frame Handler for easing
            easeFrames(tl, pl, startStamp, (position: {x: number, y: number}) => {

                let translate = `translate(${position.x}px, ${position.y}px)`;
                fixedElem.fixed.style.webkitTransform = translate;
                fixedElem.fixed.style.transform = translate;

                // Offset elements scrolling if there are any present
                if (Array.isArray(activeOffsets)) {

                    for (let i = 0; i < activeOffsets.length; i++) {
                        let e = activeOffsets[i];

                        e = Object.assign({}, THIS.defaultSpeeds, e);
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
                tl: {x: number, y: number}, 
                pl: {x: number, y: number}, 
                startStamp: number, 
                onIterate: (position: {x: number, y: number}) => void
            ) {

                // Parse bezier easing string into number values
                let easing = parseBezierString(dataObj.easing);

                let diffX = ((tl.x * -1) - pl.x);
                let diffY = ((tl.y * -1) - pl.y);
                let dx, dy;

                // Animation frame loop
                (function loop() {

                    let t = (Date.now() - startStamp) / dataObj.duration!;

                    if (t > 1) t = 1.01;
                    if (t < 1) {
                        dx = (diffX * bezier.apply(null, easing)(t)) + tl.x;
                        dy = (diffY * bezier.apply(null, easing)(t)) + tl.y;

                        dx = Math.ceil(dx * 100) / 100;
                        dy = Math.ceil(dy * 100) / 100;
                        onIterate({ x: dx, y: dy });

                        window.requestAnimationFrame(loop);
                    }
                }());

                function parseBezierString(bezierString: any) {
                    let valObj = THIS.pennerEasing.filter(e => e.name == bezierString);
                    let vals: [mX1: number, mY1: number, mX2: number, mY2: number];
                    if (valObj[0]) {
                        vals = <[mX1: number, mY1: number, mX2: number, mY2: number]> valObj[0].value;
                    } else {
                        bezierString = bezierString.split(/([^\(-\)]*)/);
                        bezierString = bezierString[3].split(/,(?![^()]*\()/);
                        vals = bezierString.map((x: any) => { return parseFloat(x) });
                    }

                    if (Array.isArray(vals) && vals.length == 4)
                        return vals;
                    else
                        throw "easing string is invalid.";
                }
            }
        }



        // Remove all slickScroll handers and return DOM to original state
        function onDestroy() {
            let activeOffsets = getFromOffsetArray(THIS.offsets, rootElem);
            let activeFixedOffsets = getFromOffsetArray(THIS.fixed, rootElem);
            let wrapper: any = rootElem.querySelector("._SS_wrapper");

            // Remove all Observers and EventListeners
            rootElem.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            mutationObserver.disconnect();

            // Revert root element to original state and remove all slickscroll classes
            for (let i = wrapper.children.length; i > 0; i--) {
                if (wrapper.children[i-1].removeProperty) wrapper.children[i-1].removeProperty("transform");
                rootElem.insertBefore(wrapper.children[i-1], rootElem.children[0]);
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
            index = (THIS.fixed as any[]).findIndex(obj => obj.element == selectNode(dataObj.root));
            THIS.fixed.splice(index, 1);
            index = (THIS.offsets as any[]).findIndex(obj => obj.element == selectNode(dataObj.root));
            THIS.offsets.splice(index, 1);

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

            let activeOffsets = getFromOffsetArray(THIS.offsets, rootElem);

            if (typeof obj !== "object") return;

            // Check if offset already exists
            const find = activeOffsets.find((i: any) => i.element == obj.element);
            if (find || !obj.element) return;

            // Assign an offset and push it to offsets array
            obj = Object.assign({}, THIS.defaultSpeeds, obj);
            pushToOffsetArray(THIS.offsets, rootElem, obj);
        }



        // Add fixedOffsets after intialization
        function addFixedOffset(element: string | HTMLElement | HTMLBodyElement | null) {
            let activeFixedOffsets = getFromOffsetArray(THIS.fixed, rootElem);
            
            if (!selectNode(element, true) || activeFixedOffsets.includes(element)) 
                return;
            
            pushToOffsetArray(THIS.fixed, rootElem, element);
        }



        // Disable and remove an active Fixed or Regular Offset
        function removeOffset(element: string | HTMLElement | HTMLBodyElement | null) {
            
            let activeItem = getFromOffsetArray(THIS.offsets, rootElem);
            let activeFixedItem = getFromOffsetArray(THIS.fixed, rootElem);

            let offsetIndex = THIS.offsets.findIndex((e: any) => e.element == rootElem);
            let fixedIndex = THIS.fixed.findIndex((e: any) => e.element == rootElem);

            if (activeItem.length > 0) {
                THIS.offsets[offsetIndex].items = removeFromOffsetArray(activeItem, selectNode(element, true));
                THIS.offsets[offsetIndex].items = removeFromOffsetArray(activeItem, element);
            }
            if (activeFixedItem.length > 0) {
                THIS.fixed[fixedIndex].items = removeFromOffsetArray(activeFixedItem, selectNode(element, true));
                THIS.fixed[fixedIndex].items = removeFromOffsetArray(activeFixedItem, element);
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
                child.insertBefore(root.children[(i-1)], child.children[0]);
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



        // Typescript version of gre's bezier-easing 
        // https://github.com/gre/bezier-easing/blob/master/src/index.js
        function bezier(mX1: number, mY1: number, mX2: number, mY2: number) {

            var newton_iterations = 4;
            var newton_min_slope = 0.001;
            var subdivision_precision = 0.0000001;
            var subdivision_max_iterations = 10;

            var kSplineTableSize = 11;
            var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

            var float32ArraySupported = typeof Float32Array === 'function';

            function A(aA1: number, aA2: number) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }

            function B(aA1: number, aA2: number) { return 3.0 * aA2 - 6.0 * aA1; }

            function C(aA1: number) { return 3.0 * aA1; }

            function calcBezier(aT: number, aA1: number, aA2: number) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }

            function getSlope(aT: number, aA1: number, aA2: number) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

            function binarySubdivide(aX: number, aA: number, aB: number, mX1: number, mX2: number,) {
                var currentX, currentT, i = 0;
                do {
                    currentT = aA + (aB - aA) / 2.0;
                    currentX = calcBezier(currentT, mX1, mX2) - aX;
                    if (currentX > 0.0) {
                        aB = currentT;
                    } else {
                        aA = currentT;
                    }
                } while (Math.abs(currentX) > subdivision_precision && ++i < subdivision_max_iterations);
                return currentT;
            }

            function newtonRaphsonIterate(aX: number, aGuessT: number, mX1: number, mX2: number) {
                for (var i = 0; i < newton_iterations; ++i) {
                    var currentSlope = getSlope(aGuessT, mX1, mX2);
                    if (currentSlope === 0.0) {
                        return aGuessT;
                    }
                    var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
                    aGuessT -= currentX / currentSlope;
                }
                return aGuessT;
            }

            function LinearEasing(x: number) { return x; }

            if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
                throw new Error('bezier x values must be in [0, 1] range');
            }

            if (mX1 === mY1 && mX2 === mY2) return LinearEasing;

            var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
            for (var i = 0; i < kSplineTableSize; ++i) {
                sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
            }

            function getTForX(aX: number) {
                var intervalStart = 0.0;
                var currentSample = 1;
                var lastSample = kSplineTableSize - 1;

                for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
                    intervalStart += kSampleStepSize;
                }
                --currentSample;

                // Interpolate to provide an initial guess for t
                var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
                var guessForT = intervalStart + dist * kSampleStepSize;

                var initialSlope = getSlope(guessForT, mX1, mX2);
                if (initialSlope >= newton_min_slope) {
                    return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
                } else if (initialSlope === 0.0) {
                    return guessForT;
                } else {
                    return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
                }
            }

            return (x: number) => {
                if (x === 0 || x === 1) return x;
                return calcBezier(getTForX(x), mY1, mY2);
            };
        };
    }




    // The inView slickscroll function
    public inView(element: string | HTMLElement | NodeList | null) {
        if (!element) return;
        if (NodeList.prototype.isPrototypeOf(element!)) {
            console.warn("Multiple elements are not selectable at inView"); 
            return;
        }
        let e = selectNode(element);

        let parent = scrollableParent(e);
        let parentViewTop = parent.getBoundingClientRect().top;
        let parentViewBottom = parentViewTop + parent.getBoundingClientRect().height;

        var elemTop = e.getBoundingClientRect().top;
        var elemBottom = elemTop + (e.getBoundingClientRect().height);

        // Returns boolean on if element is in view or not
        return (
            ((elemBottom <= parentViewBottom) && (elemTop >= parentViewTop)) &&
            ((elemBottom > 0) && (elemTop <= window.innerHeight))
        );

        // Go through parent list to find first scrollable parent
        function scrollableParent(e: any): any {
            if (e == null) return document.body;
            let overflow = window.getComputedStyle(e).getPropertyValue('overflow');
            if (e.scrollHeight > e.clientHeight && overflow != "visible" && overflow != "hidden") return e;
            return scrollableParent(e.parentNode);
        }
    }
}







/* Helper Functions */

// Initalize an array of fixedOffsets or offsets
function setOffsetArray(array: any[], id: any, data?: any[]) {
    let itemArr: {element: any, items: any[]}[] = array.filter(obj => obj.element == id);
    if (itemArr.length > 0) {
        if (data) itemArr[0].items = data;
        itemArr[0].element = id;
    } else {
        let obj;
        if (data) {
            obj = { element: id, items: data };
        } else {
            obj = { element: id };
        }
        array.push(obj);
    }
}


// Push to an offsets or fixedOffsets Array
function pushToOffsetArray(array: any[], id: any, data?: any) {
    let index = array.findIndex(obj => obj.element == id);
    array[index].items.push(data);
}


// Remove specific offset from fixedOffsets or offsets
function removeFromOffsetArray(array: any[], item: any) {
    let index = array.findIndex(obj => obj.element == item || obj == item);
    if (index > -1) {
        
        let elements = array[index];
        if (typeof elements == "object" && !elements.nodeName) elements = elements.element;

        elements = selectNode(elements, true);

        if (NodeList.prototype.isPrototypeOf(elements)) {
            for (let e of elements as any) {
                e.style.removeProperty("transform");
                e.style.removeProperty("-webkit-transform");
                if (e.style.position == "fixed") e.style.removeProperty("position");
            }
            return;
        }

        elements.style.removeProperty("transform");
        elements.style.removeProperty("-webkit-transform");
        if (elements.style.position == "fixed") elements.style.removeProperty("position");

        array.splice(index, 1);
    }
    return array;
}


// Fetch an offset from fixedOffsets or offsets
function getFromOffsetArray(array: any[], id: any) {
    let item = array.filter(obj => obj.element == id);
    return item[0].items;
}


// Select the node if a query string is provided
function selectNode(elem: any, multiple?: boolean) {
    // return node if element is string
    if (typeof elem == "string") {
        if (multiple) {
            return <any> document.querySelectorAll(elem);
        } else {
            return <any>document.querySelector(elem);
        }
    } else {
        // return elem itself if already a node
        return elem;
    }
}