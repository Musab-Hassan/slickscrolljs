/**************************************
*            SlickScrollJS
*           © Musab Hassan
*
*        For building this file,
*      refer to gulpfile.ts or type
*             gulp tasks.
*
***************************************/
var slickScroll = /** @class */ (function () {
    function slickScroll() {
        // default properties
        this.defaults = {
            root: "body",
            duration: 1000,
            easing: "cubic-bezier(0.15, 1, 0.4, 1)",
            offsets: { speedX: 1, speedY: 1 }
        };
        // default pennerEasings
        this.pennerEasing = [
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
        ];
        // Offset cache
        this.fixed = [];
        this.offsets = [];
    }
    // mometumScrolling
    slickScroll.prototype.momentumScroll = function (dataObj) {
        var _this = this;
        var THIS = this; // class's 'this' for access from inner functions
        dataObj = Object.assign({}, this.defaults, dataObj); // assign defaults to dataObj object if any missing properties
        var pl, startStamp;
        var rootElem = selectNode(dataObj.root);
        // set any assigned offsets or fixedOffsets
        setOffsetArray(this.fixed, selectNode(dataObj.root), dataObj.fixedOffsets);
        setOffsetArray(this.offsets, selectNode(dataObj.root), dataObj.offsets);
        // if client is phone or unsupported
        if (!isCompatible()) {
            var activeFixedOffsets = getFromOffsetArray(this.fixed, selectNode(dataObj.root));
            rootElem.addEventListener("scroll", function (event) {
                var activeOffsets = getFromOffsetArray(_this.offsets, selectNode(dataObj.root));
                // Offset elements scrolling
                if (activeOffsets) {
                    activeOffsets.forEach(function (e) {
                        e = Object.assign({}, _this.defaults.offsets, e);
                        var offset = "translate(" + event.target.scrollLeft * (1 - e.speedX) + "px, " + event.target.scrollTop * (1 - e.speedY) + "px)";
                        var elements = selectNode(e.element, true);
                        for (var _i = 0, _a = elements; _i < _a.length; _i++) {
                            e = _a[_i];
                            e.style.webkitTransform = offset;
                            e.style.transform = offset;
                        }
                    });
                }
            });
            // Fixed elements
            if (activeFixedOffsets) {
                activeFixedOffsets.forEach(function (e) {
                    var elements = selectNode(e, true);
                    for (var _i = 0, _a = elements; _i < _a.length; _i++) {
                        e = _a[_i];
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
            };
        }
        // if client is desktop and supported
        var fixedElem = DOMRestructure(rootElem);
        var mutationObserver = new MutationObserver(onResize);
        // Detect any changes to root element's appearance
        window.addEventListener("resize", onResize);
        mutationObserver.observe(selectNode(dataObj.root), {
            childList: true,
            attributes: true,
            subtree: true
        });
        rootElem.addEventListener("scroll", onScroll);
        return {
            destroy: onDestroy,
            removeOffset: removeOffset,
            addOffset: addOffset,
            addFixedOffset: addFixedOffset
        };
        /* Functions for momentumScroll*/
        // Scroll Event on root element
        function onScroll(e) {
            var activeOffsets = getFromOffsetArray(THIS.offsets, selectNode(dataObj.root));
            var activeFixedOffsets = getFromOffsetArray(THIS.fixed, selectNode(dataObj.root));
            if (dataObj.onScroll)
                dataObj.onScroll(e);
            pl = { y: rootElem.scrollTop, x: rootElem.scrollLeft };
            if (typeof pl.x === "undefined")
                pl = { y: rootElem.scrollY, x: rootElem.scrollX };
            var style = window.getComputedStyle(fixedElem.fixed);
            var matrix = new WebKitCSSMatrix(style.transform);
            var tl = { x: matrix.m41, y: matrix.m42 };
            startStamp = Date.now();
            // Apply transform on children based on calculated value
            easeFrames(tl, pl, startStamp, function (position) {
                var translate = "translate(" + position.x + "px, " + position.y + "px)";
                fixedElem.fixed.style.webkitTransform = translate;
                fixedElem.fixed.style.transform = translate;
                // Offset elements scrolling if there are any present
                if (Array.isArray(activeOffsets)) {
                    if (activeOffsets.length < 1)
                        return;
                    activeOffsets.forEach(function (e) {
                        e = Object.assign({}, THIS.defaults.offsets, e);
                        var offset = "translate(" + position.x * (e.speedX - 1) + "px, " + position.y * (e.speedY - 1) + "px)";
                        var elements = selectNode(e.element, true);
                        if (NodeList.prototype.isPrototypeOf(elements)) {
                            for (var _i = 0, _a = elements; _i < _a.length; _i++) {
                                var e_1 = _a[_i];
                                e_1.style.webkitTransform = offset;
                                e_1.style.transform = offset;
                            }
                        }
                        else {
                            elements.style.webkitTransform = offset;
                            elements.style.transform = offset;
                        }
                    });
                }
                // Fixed elements being set as fixed if there are any present
                if (Array.isArray(activeFixedOffsets)) {
                    if (activeFixedOffsets.length < 1)
                        return;
                    for (var i = 0; i < activeFixedOffsets.length; i++) {
                        var offset = "translate(" + position.x * -1 + "px, " + position.y * -1 + "px)";
                        var elements = selectNode(activeFixedOffsets[i], true);
                        if (NodeList.prototype.isPrototypeOf(elements)) {
                            for (var _i = 0, _a = elements; _i < _a.length; _i++) {
                                var e_2 = _a[_i];
                                e_2.style.webkitTransform = offset;
                                e_2.style.transform = offset;
                            }
                        }
                        else {
                            elements.style.webkitTransform = offset;
                            elements.style.transform = offset;
                        }
                    }
                }
            });
            // Returns calculated translate value based on scroll position
            function easeFrames(tl, pl, startStamp, onIterate) {
                // Parse easing string into floats
                var easing = parseBezier(dataObj.easing);
                var diffX = ((tl.x * -1) - pl.x);
                var diffY = ((tl.y * -1) - pl.y);
                var dx, dy;
                // Animation frame loop
                (function loop() {
                    var t = (Date.now() - startStamp) / dataObj.duration;
                    if (t > 1)
                        t = 1.01;
                    if (t < 1) {
                        dx = (diffX * bezier.apply(null, easing)(t)) + tl.x;
                        dy = (diffY * bezier.apply(null, easing)(t)) + tl.y;
                        dx = Math.ceil(dx * 100) / 100;
                        dy = Math.ceil(dy * 100) / 100;
                        onIterate({ x: dx, y: dy });
                        window.requestAnimationFrame(loop);
                    }
                }());
                function parseBezier(bezierString) {
                    var valObj = THIS.pennerEasing.filter(function (e) { return e.name == bezierString; });
                    var vals;
                    if (valObj[0]) {
                        vals = valObj[0].value;
                    }
                    else {
                        bezierString = bezierString.split(/([^\(-\)]*)/);
                        bezierString = bezierString[3].split(/,(?![^()]*\()/);
                        vals = bezierString.map(function (x) { return parseFloat(x); });
                    }
                    if (Array.isArray(vals) && vals.length == 4)
                        return vals;
                    else
                        throw "easing string is invalid.";
                }
            }
        }
        // Unset onscroll and return dom to original state
        function onDestroy() {
            var activeOffsets = getFromOffsetArray(THIS.offsets, selectNode(dataObj.root));
            var activeFixedOffsets = getFromOffsetArray(THIS.fixed, selectNode(dataObj.root));
            var wrapper = selectNode(dataObj.root).querySelector("._SS_wrapper");
            // Remove all Observers and eventlisteners
            rootElem.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            mutationObserver.disconnect();
            // Revert element root's node to original state by removing all slickscroll classes
            for (var i = wrapper.children.length; i > 0; i--) {
                if (wrapper.children[i - 1].removeProperty)
                    wrapper.children[i - 1].removeProperty("transform");
                rootElem.insertBefore(wrapper.children[i - 1], rootElem.children[0]);
            }
            wrapper.remove();
            selectNode(dataObj.root).querySelector("._SS_dummy").remove();
            rootElem.style.removeProperty("overflow");
            rootElem.style.removeProperty("position");
            clearTransform(activeOffsets);
            clearTransform(activeFixedOffsets);
            // Remove instance from fixedOffsets and offsets arrays
            var index;
            index = THIS.fixed.findIndex(function (obj) { return obj.element == selectNode(dataObj.root); });
            THIS.fixed.splice(index, 1);
            index = THIS.offsets.findIndex(function (obj) { return obj.element == selectNode(dataObj.root); });
            THIS.offsets.splice(index, 1);
            function clearTransform(array) {
                if (array) {
                    array.forEach(function (e) {
                        var elements = selectNode(e.element, true);
                        if (!e.element)
                            elements = selectNode(e, true);
                        if (NodeList.prototype.isPrototypeOf(elements)) {
                            for (var _i = 0, _a = elements; _i < _a.length; _i++) {
                                e = _a[_i];
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
        function addOffset(obj) {
            var activeOffset = getFromOffsetArray(THIS.offsets, selectNode(dataObj.root));
            if (activeOffset.length <= 0)
                activeOffset = getFromOffsetArray(THIS.offsets, dataObj.root);
            if (typeof obj !== "object")
                return;
            if (!("element" in obj)) {
                console.warn("Node not found for addOffset");
                return;
            }
            // Check if offset is already set
            var find = activeOffset.find(function (i) { return i.element == obj.element; });
            if (find || !obj.element)
                return;
            obj = Object.assign({}, THIS.defaults.offsets, obj);
            pushToOffsetArray(THIS.offsets, dataObj.root, obj);
        }
        // Add fixedOffsets after intialization
        function addFixedOffset(element) {
            var activeFixedOffsets = getFromOffsetArray(THIS.fixed, selectNode(dataObj.root));
            if (activeFixedOffsets.length <= 0)
                activeFixedOffsets = getFromOffsetArray(THIS.offsets, dataObj.root);
            if (!selectNode(element, true) || activeFixedOffsets.includes(element))
                return;
            pushToOffsetArray(THIS.fixed, selectNode(dataObj.root), element);
        }
        // Remove specific node from offset or fixedoffset
        function removeOffset(element) {
            var activeItem = getFromOffsetArray(THIS.offsets, selectNode(dataObj.root));
            var activeFixedItem = getFromOffsetArray(THIS.fixed, selectNode(dataObj.root));
            var offsetIndex = THIS.offsets.findIndex(function (e) { return e.element == selectNode(dataObj.root); });
            var fixedIndex = THIS.fixed.findIndex(function (e) { return e.element == selectNode(dataObj.root); });
            if (activeItem.length > 0) {
                THIS.offsets[offsetIndex].items = removeFromOffsetArray(activeItem, selectNode(element, true));
                THIS.offsets[offsetIndex].items = removeFromOffsetArray(activeItem, element);
            }
            if (activeFixedItem.length > 0) {
                THIS.fixed[fixedIndex].items = removeFromOffsetArray(activeFixedItem, selectNode(element, true));
                THIS.fixed[fixedIndex].items = removeFromOffsetArray(activeFixedItem, element);
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
            var child = document.createElement('div');
            var dummy = document.createElement('div');
            child.classList.add("_SS_wrapper");
            dummy.classList.add("_SS_dummy");
            for (var i = root.children.length; i > 0; i--) {
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
        // Check for mobile & unsupported browsers
        function isCompatible() {
            var check = false;
            (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
                check = true; })(navigator.userAgent || navigator.vendor);
            if (!check && CSS.supports)
                check = !CSS.supports("position", "sticky");
            return !check;
        }
        // Typescript version of bezier-easing https://github.com/gre/bezier-easing/blob/master/src/index.js
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
                    }
                    else {
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
            if (mX1 === mY1 && mX2 === mY2)
                return LinearEasing;
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
                }
                else if (initialSlope === 0.0) {
                    return guessForT;
                }
                else {
                    return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
                }
            }
            return function (x) {
                if (x === 0 || x === 1)
                    return x;
                return calcBezier(getTForX(x), mY1, mY2);
            };
        }
        ;
    };
    // The inView slickscroll function
    slickScroll.prototype.inView = function (element) {
        if (!element)
            return;
        if (NodeList.prototype.isPrototypeOf(element)) {
            console.warn("Multiple elements are not selectable at inView");
            return;
        }
        var e = selectNode(element);
        var parent = scrollableParent(e);
        var parentViewTop = parent.getBoundingClientRect().top;
        var parentViewBottom = parentViewTop + parent.getBoundingClientRect().height;
        var elemTop = e.getBoundingClientRect().top;
        var elemBottom = elemTop + (e.getBoundingClientRect().height);
        // Returns boolean on if element is in view or not
        return (((elemBottom <= parentViewBottom) && (elemTop >= parentViewTop)) &&
            ((elemBottom > 0) && (elemTop <= window.innerHeight)));
        // Go through parent list to find first scrollable parent
        function scrollableParent(e) {
            if (e == null)
                return document.body;
            var overflow = window.getComputedStyle(e).getPropertyValue('overflow');
            if (e.scrollHeight > e.clientHeight && overflow != "visible" && overflow != "hidden")
                return e;
            return scrollableParent(e.parentNode);
        }
    };
    return slickScroll;
}());
 
/* Helper Functions */
// Find and insert into array of fixedOffsets or offsets
function setOffsetArray(array, id, data) {
    var itemArr = array.filter(function (obj) { return obj.element == id; });
    if (itemArr.length > 0) {
        if (data)
            itemArr[0].items = data;
        itemArr[0].element = id;
    }
    else {
        var obj = void 0;
        if (data) {
            obj = { element: id, items: data };
        }
        else {
            obj = { element: id };
        }
        array.push(obj);
    }
}
// Add an offset or fixedOffset
function pushToOffsetArray(array, id, data) {
    var index = array.findIndex(function (obj) { return obj.element == id; });
    array[index].items.push(data);
}
// Remove specific offset from fixedOffsets and offsets
function removeFromOffsetArray(array, item) {
    var index = array.findIndex(function (obj) { return obj.element == item || obj == item; });
    if (index > -1) {
        var elements = array[index];
        if (typeof elements == "object" && !elements.nodeName)
            elements = elements.element;
        elements = selectNode(elements, true);
        if (NodeList.prototype.isPrototypeOf(elements)) {
            for (var _i = 0, _a = elements; _i < _a.length; _i++) {
                var e = _a[_i];
                e.style.removeProperty("transform");
                e.style.removeProperty("-webkit-transform");
                if (e.style.position == "fixed")
                    e.style.removeProperty("position");
            }
            return;
        }
        elements.style.removeProperty("transform");
        elements.style.removeProperty("-webkit-transform");
        if (elements.style.position == "fixed")
            elements.style.removeProperty("position");
        array.splice(index, 1);
    }
    return array;
}
// Fetch from fixedOffsets and offsets
function getFromOffsetArray(array, id) {
    var item = array.filter(function (obj) { return obj.element == id; });
    return item[0].items;
}
// Return node incase string is provided
function selectNode(elem, multiple) {
    // return node if element is string
    if (typeof elem == "string") {
        if (multiple) {
            return document.querySelectorAll(elem);
        }
        else {
            return document.querySelector(elem);
        }
    }
    else {
        // return elem itself if already a node
        return elem;
    }
}
