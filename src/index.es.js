/**************************************
*          # SlickScrollJS #
*
*          Copyright (2021)
*            Musab Hassan
*
*    https://github.com/Musab-Hassan/
*
***************************************/


export default class slickScroll {

    // Defaults
    defaults = {
        root: "body",
        duration: 1000,
        easing: "cubic-bezier(0.15, 1, 0.4, 1)",
        offsets: {speedX: 1, speedY: 1}
    };
    presetEasings = [
        // Sine
        {name: "easeInSine", value: [0.12, 0, 0.39, 0]},
        {name: "easeOutSine", value: [0.61, 1, 0.88, 1]},
        {name: "easeInOutSine", value: [0.37, 0, 0.63, 1]},
        // Quad
        {name: "easeInQuad", value: [0.11, 0, 0.5, 0]},
        {name: "easeOutQuad", value: [0.5, 1, 0.89, 1]},
        {name: "easeInOutQuad", value: [0.45, 0, 0.55, 1]},
        // Cubic
        {name: "easeInCubic", value: [0.32, 0, 0.67, 0]},
        {name: "easeOutCubic", value: [0.33, 1, 0.68, 1]},
        {name: "easeInOutCubic", value: [0.65, 0, 0.35, 1]},
        // Quart
        {name: "easeInQuart", value: [0.5, 0, 0.75, 0]},
        {name: "easeOutQuart", value: [0.25, 1, 0.5, 1]},
        {name: "easeInOutQuart", value: [0.76, 0, 0.24, 1]},
        // Quint
        {name: "easeInQuint", value: [0.64, 0, 0.78, 0]},
        {name: "easeOutQuint", value: [0.22, 1, 0.36, 1]},
        {name: "easeInOutQuint", value: [0.83, 0, 0.17, 1]},
        // Expo
        {name: "easeInExpo", value: [0.7, 0, 0.84, 0]},
        {name: "easeOutExpo", value: [0.16, 1, 0.3, 1]},
        {name: "easeInOutExpo", value: [0.87, 0, 0.13, 1]},
        // Circ
        {name: "easeInCirc", value: [0.55, 0, 1, 0.45]},
        {name: "easeOutCirc", value: [0, 0.55, 0.45, 1]},
        {name: "easeInOutCirc", value: [0.85, 0, 0.15, 1]}
    ];


    offsets = [];
    fixed = [];

    momentumScroll(dataObj) {
        // Set unset properties to defaults
        dataObj = Object.assign({}, this.defaults, dataObj);

        let pl, startStamp;
        let classThis = this;
        let rootElem = document.querySelector(dataObj.root);
        let fixedElem = DOMRestructure(rootElem);
        
        this.fixed[dataObj.root] = dataObj.fixedOffsets;
        this.offsets[dataObj.root] = dataObj.offsets;
        if (!dataObj.offsets) this.offsets[dataObj.root] = [];
        if (!dataObj.fixedOffsets) this.fixed[dataObj.root] = [];

        rootElem.addEventListener("scroll", onScroll);
        window.addEventListener("resize", onResize);
        
        return {
            destroy: onDestroy,
            removeOffset: removeOffset,
            addOffset: addOffset,
            addFixedOffset: addFixedOffset
        }


        // Scroll Event on root element
        function onScroll(e) {
            if (dataObj.onScroll) dataObj.onScroll(e);

            pl = { y: rootElem.scrollTop, x: rootElem.scrollLeft };
            if (typeof pl.x === "undefined") pl = { y: rootElem.scrollY, x: rootElem.scrollX };
            
            let style = window.getComputedStyle(fixedElem.fixed);
            let matrix = new WebKitCSSMatrix(style.transform);
            let tl = {x: matrix.m41, y: matrix.m42}

            startStamp = Date.now();

            // Apply transform on children based on calculated value
            easeFrames(tl, pl, startStamp, (position) => {
                let translate = `translate(${position.x}px, ${position.y}px)`;
                fixedElem.fixed.style.webkitTransform = translate;
                fixedElem.fixed.style.transform = translate;
                
                // Offset elements scrolling
                if (classThis.offsets[dataObj.root]) {
                    
                    classThis.offsets[dataObj.root].forEach((e) => {
                        e = Object.assign({}, classThis.defaults.offsets, e);
                        
                        let offset = `translate(${position.x * (e.speedX - 1)}px, ${position.y * (e.speedY - 1)}px)`;
                        let elements = document.querySelectorAll(e.element);
                        
                        for (e of elements) {
                            e.style.webkitTransform = offset;
                            e.style.transform = offset;
                        }
                    });
                }

                // Fixed elements
                if (classThis.fixed[dataObj.root]) {
                    classThis.fixed[dataObj.root].forEach((e) => {

                        let offset = `translate(${position.x * -1}px, ${position.y * -1}px)`;
                        let elements = document.querySelectorAll(e);
                        
                        for (e of elements) {
                            e.style.webkitTransform = offset;
                            e.style.transform = offset;
                        }
                    });
                }
            });

            // Provides calculated value for transforming based on scroll position
            function easeFrames(tl, pl, startStamp, onIterate) {
                // Parse easing string into floats
                let easing = parseBezier(dataObj.easing);

                let diffX = ((tl.x*-1) - pl.x);
                let diffY = ((tl.y*-1) - pl.y);
                let dx, dy;

                // Transfrom frame loop
                (function loop() {

                    let t = (Date.now() - startStamp) / dataObj.duration;

                    if (t > 1) t = 1.01;
                    if (t < 1) {
                        dx = (diffX * bezier.apply(null, easing)(t)) + tl.x;
                        dy = (diffY * bezier.apply(null, easing)(t)) + tl.y;

                        dx = Math.ceil(dx * 100) / 100;
                        dy = Math.ceil(dy * 100) / 100;
                        onIterate({x: dx, y: dy});

                        window.requestAnimationFrame(loop);
                    }
                }());

                function parseBezier(bezierString) {
                    let vals = classThis.presetEasings.filter(e => e.name == bezierString);
                    if (vals[0]) {
                        vals = vals[0].value;
                    } else {
                        bezierString = bezierString.split(/([^\(-\)]*)/);
                        bezierString = bezierString[3].split(/,(?![^()]*\()/);
                        vals = bezierString.map((x) => { return parseFloat(x) });
                    }

                    if (Array.isArray(vals) && vals.length == 4)
                        return vals;
                    else
                        throw "easing string is invalid.";
                }
            }
        }

        // Unset onscroll and return dom to original state
        function onDestroy(fullDestroy) {
            if (typeof fullDestroy == "undefined") fullDestroy = false;
            
            let wrapper = document.querySelector(dataObj.root + " ._SS_wrapper");
            rootElem.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            // Revert element DOM structure to original state if fullDestroy
            if (fullDestroy) {
                for (const e of wrapper.children) {
                    e.style.removeProperty("transform");
                    rootElem.appendChild(e.cloneNode(true));
                }
                wrapper.remove();
            } else {
                wrapper.removeAttribute("style");
            }
            document.querySelector(dataObj.root + " ._SS_dummy").remove();
            rootElem.style.removeProperty("overflow");
            rootElem.style.removeProperty("position");

            clearTransform(classThis.fixed[dataObj.root]);
            clearTransform(classThis.offsets[dataObj.root]);

            function clearTransform(array) {
                if (array) {
                    array.forEach((e) => {
                        elements = document.querySelectorAll(e.element);
                        if (!e.element) elements = document.querySelectorAll(e);
                        for (e of elements) {
                            e.style.removeProperty("transform");
                            e.style.removeProperty("-webkit-transform");
                        }
                    });
                }
            }
        }
        
        // Add Offsets after intialization
        function addOffset(obj) {
            if (typeof obj !== "object") return;
            if (!("element" in obj)) return;
            // Check if offset is already set
            const find = classThis.offsets[dataObj.root].find(i => i.element == obj.element);
            if (find || !document.querySelector(obj.element)) return;

            obj = Object.assign({}, classThis.defaults.offsets, obj);
            classThis.offsets[dataObj.root].push(obj);
        }

        // Add fixedOffsets after intialization
        function addFixedOffset(e) {
            if (!document.querySelector(e) || classThis.fixed[dataObj.root].includes(e)) return;
            classThis.fixed[dataObj.root].push(e);
        }

        // Allows offsets to be destroyed
        function removeOffset(element) {
            classThis.fixed[dataObj.root] = classThis.fixed[dataObj.root].filter(e => e != element);
            classThis.offsets[dataObj.root] = classThis.offsets[dataObj.root].filter(e => e.element != element);

            let elements = document.querySelectorAll(element)
            for (let e of elements) {
                e.style.removeProperty("transform");
                e.style.removeProperty("-webkit-transform");
            }
        }

        // Resize dummy on window resize to prevent over-scrolling
        function onResize() {
            fixedElem.dummy.style.height = fixedElem.fixed.scrollHeight + "px";
        }

        // Adds fixed transformable child element to the root element
        function DOMRestructure(root) {
            // Make sure root doesnt already have a position
            if (getComputedStyle(root).position != "absolute" || getComputedStyle(root).position != "fixed") {
                root.style.position = "relative";
            }
            
            let child = document.createElement('div');
            let dummy = document.createElement('div');

            child.classList.add("_SS_wrapper");
            dummy.classList.add("_SS_dummy");
            
            for (const e of root.children) {
                child.appendChild(e.cloneNode(true));
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

        // Taken from bezier-easing https://github.com/gre/bezier-easing/blob/master/src/index.js
        function bezier(mX1, mY1, mX2, mY2) {

            var newton_iterations = 4;
            var newton_min_slope = 0.001;
            var subdivision_precision = 0.0000001;
            var subdivision_max_iterations = 10;

            var kSplineTableSize = 11;
            var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

            var float32ArraySupported = typeof Float32Array === 'function';

            function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }

            function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }

            function C(aA1) { return 3.0 * aA1; }

            function calcBezier(aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }

            function getSlope(aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

            function binarySubdivide(aX, aA, aB, mX1, mX2) {
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

            function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
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

            function LinearEasing(x) { return x; }

            if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
                throw new Error('bezier x values must be in [0, 1] range');
            }

            if (mX1 === mY1 && mX2 === mY2) return LinearEasing;

            var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
            for (var i = 0; i < kSplineTableSize; ++i) {
                sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
            }

            function getTForX(aX) {
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

            return (x) => {
                if (x === 0 || x === 1) return x;
                return calcBezier(getTForX(x), mY1, mY2);
            };
        };
    }



    // The inView slickscroll function
    inView(element, events, listener) {
        var cacheIsInView;
        let e = document.querySelector(element);

        if (e) {
            isInView = isInView(e);
            if (listener) {
                // TODO: Add listener event on scroll
            } 
            else if (isInView && events.inView) events.inView()
            else if (!isInView && events.outView) events.outView()
        }

        // Go through parent list to find first scrollable parent
        function scrollableParent(e) {
            if (e == null) return document.body;
            let overflow = window.getComputedStyle(e).getPropertyValue('overflow');
            if (e.scrollHeight > e.clientHeight && overflow != "visible" && overflow != "hidden") return e;
            return scrollableParent(e.parentNode);
        }

        // Returns boolean on if element is in view or not
        function isInView(e) {
            let parent = scrollableParent(e);
            let parentViewTop = parent.getBoundingClientRect().top;
            let parentViewBottom = parentViewTop + parent.getBoundingClientRect().height;

            var elemTop = e.getBoundingClientRect().top;
            var elemBottom = elemTop + (e.getBoundingClientRect().height);

            return (
                ((elemBottom <= parentViewBottom) && (elemTop >= parentViewTop)) && 
                ((elemBottom > 0) && (elemTop <= window.innerHeight))
            );
        }
    }
}
