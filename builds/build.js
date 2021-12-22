var slickScroll;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/momentumScroll/defaults.ts":
/*!****************************************!*\
  !*** ./src/momentumScroll/defaults.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "defaults": () => (/* binding */ defaults),
/* harmony export */   "defaultSpeeds": () => (/* binding */ defaultSpeeds),
/* harmony export */   "pennerEasings": () => (/* binding */ pennerEasings)
/* harmony export */ });
/* Default values and properties for momentumScroll */
// Default properties for momentumScrollStruct
var defaults = {
    root: "body",
    duration: 1000,
    easing: "cubic-bezier(0.15, 1, 0.4, 1)",
    offsets: [],
    fixedOffsets: []
};
// Default offset speeds
var defaultSpeeds = {
    speedY: 1,
    speedX: 1
};
// Default pennerEasings
var pennerEasings = [
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


/***/ }),

/***/ "./src/momentumScroll/main.ts":
/*!************************************!*\
  !*** ./src/momentumScroll/main.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "momentumScroll": () => (/* binding */ momentumScroll)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");
/* harmony import */ var _defaults__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./defaults */ "./src/momentumScroll/defaults.ts");
/*         momentumScroll/main.ts          */
/*  source of the momentumScroll function  */


var fixedOffsets = [];
var offsets = [];
function momentumScroll(dataObj) {
    // Assign defaults to dataObj object
    dataObj = Object.assign({}, _defaults__WEBPACK_IMPORTED_MODULE_1__.defaults, dataObj);
    let pl;
    let startStamp;
    let rootElem = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.selectNode)(dataObj.root);
    // Set any offsets or fixedOffsets assigned on initialization
    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.setOffsetArray)(fixedOffsets, rootElem, dataObj.fixedOffsets);
    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.setOffsetArray)(offsets, rootElem, dataObj.offsets);
    // if client is phone or unsupported
    if (!isCompatible()) {
        let activeFixedOffsets = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getFromOffsetArray)(fixedOffsets, rootElem);
        rootElem.addEventListener("scroll", (event) => {
            let activeOffsets = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getFromOffsetArray)(offsets, rootElem);
            // Offset elements scrolling
            if (activeOffsets) {
                activeOffsets.forEach((e) => {
                    e = Object.assign({}, _defaults__WEBPACK_IMPORTED_MODULE_1__.defaultSpeeds, e);
                    let offset = `translate(${event.target.scrollLeft * (1 - e.speedX)}px, ${event.target.scrollTop * (1 - e.speedY)}px)`;
                    let elements = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.selectNode)(e.element, true);
                    for (e of elements) {
                        e.style.webkitTransform = offset;
                        e.style.transform = offset;
                    }
                });
            }
        });
        // Fixed elements
        if (activeFixedOffsets) {
            activeFixedOffsets.forEach((e) => {
                let elements = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.selectNode)(e, true);
                for (e of elements) {
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
    // if not phone or unsupported then then ->
    let fixedElem = DOMRestructure(rootElem);
    let mutationObserver = new MutationObserver(onResize);
    // Detect any changes to root element's appearance
    window.addEventListener("resize", onResize);
    mutationObserver.observe(rootElem, {
        childList: true,
        attributes: true,
        subtree: true
    });
    // Scroll handler
    rootElem.addEventListener("scroll", onScroll);
    return {
        destroy: onDestroy,
        removeOffset: removeOffset,
        addOffset: addOffset,
        addFixedOffset: addFixedOffset
    };
    /* Event Handler Functions */
    // Scroll handler
    function onScroll(e) {
        if (dataObj.onScroll)
            dataObj.onScroll(e); // Run passed onScroll function
        let activeOffsets = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getFromOffsetArray)(offsets, rootElem);
        let activeFixedOffsets = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getFromOffsetArray)(fixedOffsets, rootElem);
        // Get scroll location of rootElement
        pl = { x: rootElem.scrollLeft, y: rootElem.scrollTop };
        if (typeof pl.x === "undefined" || typeof pl.y === "undefined")
            pl = { x: rootElem.scrollX, y: rootElem.scrollY, };
        // Get transform coordinates of fixedElements
        let style = window.getComputedStyle(fixedElem.fixed);
        let matrix = new WebKitCSSMatrix(style.transform);
        let tl = { x: matrix.m41, y: matrix.m42 };
        // Current time for timing to work
        startStamp = Date.now();
        // Scroll Animation Frame Handler for easing
        easeFrames(tl, pl, startStamp, (position) => {
            let translateString = `translate(${position.x}px, ${position.y}px)`;
            fixedElem.fixed.style.webkitTransform = translateString;
            fixedElem.fixed.style.transform = translateString;
            // Offset elements scrolling if there are any present
            if (Array.isArray(activeOffsets)) {
                for (let i = 0; i < activeOffsets.length; i++) {
                    let e = activeOffsets[i];
                    e = Object.assign({}, _defaults__WEBPACK_IMPORTED_MODULE_1__.defaultSpeeds, e);
                    let offset = `translate(${position.x * (e.speedX - 1)}px, ${position.y * (e.speedY - 1)}px)`;
                    let elements = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.selectNode)(e.element, true);
                    if (NodeList.prototype.isPrototypeOf(elements)) {
                        for (let e of elements) {
                            e.style.webkitTransform = offset;
                            e.style.transform = offset;
                        }
                    }
                    else {
                        elements.style.webkitTransform = offset;
                        elements.style.transform = offset;
                    }
                }
            }
            // set fixedOffsets as fixed
            if (Array.isArray(activeFixedOffsets)) {
                for (let i = 0; i < activeFixedOffsets.length; i++) {
                    let offset = `translate(${position.x * -1}px, ${position.y * -1}px)`;
                    let elements = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.selectNode)(activeFixedOffsets[i], true);
                    if (NodeList.prototype.isPrototypeOf(elements)) {
                        for (let e of elements) {
                            e.style.webkitTransform = offset;
                            e.style.transform = offset;
                        }
                    }
                    else {
                        elements.style.webkitTransform = offset;
                        elements.style.transform = offset;
                    }
                }
            }
        });
        // Returns calculated transform values based on scroll position
        function easeFrames(tl, pl, startStamp, onIterate) {
            // Parse bezier easing string into number values
            let easing = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.parseBezierString)(dataObj.easing);
            let diffX = ((tl.x * -1) - pl.x);
            let diffY = ((tl.y * -1) - pl.y);
            let x, y;
            // Animation frame loop
            (function loop() {
                let t = (Date.now() - startStamp) / dataObj.duration;
                if (t > 1)
                    t = 1.01;
                if (t < 1) {
                    x = (diffX * _utils__WEBPACK_IMPORTED_MODULE_0__.bezierEasing.apply(null, easing)(t)) + tl.x;
                    y = (diffY * _utils__WEBPACK_IMPORTED_MODULE_0__.bezierEasing.apply(null, easing)(t)) + tl.y;
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
        let activeOffsets = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getFromOffsetArray)(offsets, rootElem);
        let activeFixedOffsets = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getFromOffsetArray)(fixedOffsets, rootElem);
        let wrapper = rootElem.querySelector("._SS_wrapper");
        // Remove all Observers and EventListeners
        rootElem.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        mutationObserver.disconnect();
        // Revert root element to original state and remove all slickscroll classes
        for (let i = wrapper.children.length; i > 0; i--) {
            if (wrapper.children[i - 1].removeProperty)
                wrapper.children[i - 1].removeProperty("transform");
            rootElem.insertBefore(wrapper.children[i - 1], rootElem.children[0]);
        }
        wrapper.remove();
        (0,_utils__WEBPACK_IMPORTED_MODULE_0__.selectNode)(dataObj.root).querySelector("._SS_dummy").remove();
        rootElem.style.removeProperty("overflow");
        rootElem.style.removeProperty("position");
        // Clear all transformations on offsets
        clearTransform(activeOffsets);
        clearTransform(activeFixedOffsets);
        // Purge instance from fixedOffsets and offsets arrays
        let index;
        index = fixedOffsets.findIndex(obj => obj.element == (0,_utils__WEBPACK_IMPORTED_MODULE_0__.selectNode)(dataObj.root));
        fixedOffsets.splice(index, 1);
        index = offsets.findIndex(obj => obj.element == (0,_utils__WEBPACK_IMPORTED_MODULE_0__.selectNode)(dataObj.root));
        offsets.splice(index, 1);
        // Remove "transform" from an offset array
        function clearTransform(array) {
            if (array) {
                array.forEach((e) => {
                    let elements = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.selectNode)(e.element, true);
                    if (!e.element)
                        elements = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.selectNode)(e, true);
                    if (NodeList.prototype.isPrototypeOf(elements)) {
                        for (e of elements) {
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
        let activeOffsets = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getFromOffsetArray)(offsets, rootElem);
        if (typeof obj !== "object")
            return;
        // Check if offset already exists
        const find = activeOffsets.find((i) => i.element == obj.element);
        if (find || !obj.element)
            return;
        // Assign an offset and push it to offsets array
        obj = Object.assign({}, _defaults__WEBPACK_IMPORTED_MODULE_1__.defaultSpeeds, obj);
        (0,_utils__WEBPACK_IMPORTED_MODULE_0__.pushToOffsetArray)(offsets, rootElem, obj);
    }
    // Add fixedOffsets after intialization
    function addFixedOffset(element) {
        let activeFixedOffsets = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getFromOffsetArray)(fixedOffsets, rootElem);
        if (!(0,_utils__WEBPACK_IMPORTED_MODULE_0__.selectNode)(element, true) || activeFixedOffsets.includes(element))
            return;
        (0,_utils__WEBPACK_IMPORTED_MODULE_0__.pushToOffsetArray)(fixedOffsets, rootElem, element);
    }
    // Disable and remove an active Fixed or Regular Offset
    function removeOffset(element) {
        let activeItem = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getFromOffsetArray)(offsets, rootElem);
        let activeFixedItem = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getFromOffsetArray)(fixedOffsets, rootElem);
        let offsetIndex = offsets.findIndex((e) => e.element == rootElem);
        let fixedIndex = fixedOffsets.findIndex((e) => e.element == rootElem);
        if (activeItem.length > 0) {
            offsets[offsetIndex].items = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.removeFromOffsetArray)(activeItem, (0,_utils__WEBPACK_IMPORTED_MODULE_0__.selectNode)(element, true));
            offsets[offsetIndex].items = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.removeFromOffsetArray)(activeItem, element);
        }
        if (activeFixedItem.length > 0) {
            fixedOffsets[fixedIndex].items = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.removeFromOffsetArray)(activeFixedItem, (0,_utils__WEBPACK_IMPORTED_MODULE_0__.selectNode)(element, true));
            fixedOffsets[fixedIndex].items = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.removeFromOffsetArray)(activeFixedItem, element);
        }
    }
    // Resize dummy element when window resizes to prevent overscrolling
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
        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
            check = true; })(navigator.userAgent || navigator.vendor);
        if (!check && CSS.supports)
            check = !CSS.supports("position", "sticky");
        return !check;
    }
}


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "setOffsetArray": () => (/* binding */ setOffsetArray),
/* harmony export */   "pushToOffsetArray": () => (/* binding */ pushToOffsetArray),
/* harmony export */   "removeFromOffsetArray": () => (/* binding */ removeFromOffsetArray),
/* harmony export */   "getFromOffsetArray": () => (/* binding */ getFromOffsetArray),
/* harmony export */   "selectNode": () => (/* binding */ selectNode),
/* harmony export */   "parseBezierString": () => (/* binding */ parseBezierString),
/* harmony export */   "bezierEasing": () => (/* binding */ bezierEasing)
/* harmony export */ });
/* harmony import */ var _momentumScroll_defaults__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./momentumScroll/defaults */ "./src/momentumScroll/defaults.ts");
/*             utils.ts                 */
/* Globally accessible helper functions */

// Initalize an array of fixedOffsets or offsets
function setOffsetArray(array, id, data) {
    let itemArr = array.filter(obj => obj.element == id);
    if (itemArr.length > 0) {
        if (data)
            itemArr[0].items = data;
        itemArr[0].element = id;
    }
    else {
        let obj;
        if (data) {
            obj = { element: id, items: data };
        }
        else {
            obj = { element: id };
        }
        array.push(obj);
    }
}
// Push to an offsets or fixedOffsets Array
function pushToOffsetArray(array, id, data) {
    let index = array.findIndex(obj => obj.element == id);
    array[index].items.push(data);
}
// Remove specific offset from fixedOffsets or offsets
function removeFromOffsetArray(array, item) {
    let index = array.findIndex(obj => obj.element == item || obj == item);
    if (index > -1) {
        let elements = array[index];
        if (typeof elements == "object" && !elements.nodeName)
            elements = elements.element;
        elements = selectNode(elements, true);
        if (NodeList.prototype.isPrototypeOf(elements)) {
            for (let e of elements) {
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
// Fetch an offset from fixedOffsets or offsets
function getFromOffsetArray(array, id) {
    let item = array.filter(obj => obj.element == id);
    return item[0].items;
}
// Select the node if a query string is provided
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
// Converts CSS bezier string to bezier floats
function parseBezierString(bezierString) {
    let valObj = _momentumScroll_defaults__WEBPACK_IMPORTED_MODULE_0__.pennerEasings.filter(e => e.name == bezierString);
    let vals;
    if (valObj[0]) {
        vals = valObj[0].value;
    }
    else {
        bezierString = bezierString.split(/([^\(-\)]*)/);
        bezierString = bezierString[3].split(/,(?![^()]*\()/);
        vals = bezierString.map((x) => { return parseFloat(x); });
    }
    if (Array.isArray(vals) && vals.length == 4)
        return vals;
    else
        throw "easing string is invalid.";
}
// ES6 version of gre/bezier-easing 
// https://github.com/gre/bezier-easing/blob/master/src/index.js
function bezierEasing(mX1, mY1, mX2, mY2) {
    let newton_iterations = 4;
    let newton_min_slope = 0.001;
    let subdivision_precision = 0.0000001;
    let subdivision_max_iterations = 10;
    let kSplineTableSize = 11;
    let kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);
    let float32ArraySupported = typeof Float32Array === 'function';
    function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
    function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
    function C(aA1) { return 3.0 * aA1; }
    function calcBezier(aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }
    function getSlope(aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }
    function binarySubdivide(aX, aA, aB, mX1, mX2) {
        let currentX, currentT, i = 0;
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
        for (let i = 0; i < newton_iterations; ++i) {
            let currentSlope = getSlope(aGuessT, mX1, mX2);
            if (currentSlope === 0.0) {
                return aGuessT;
            }
            let currentX = calcBezier(aGuessT, mX1, mX2) - aX;
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
    let sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
    for (let i = 0; i < kSplineTableSize; ++i) {
        sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
    }
    function getTForX(aX) {
        let intervalStart = 0.0;
        let currentSample = 1;
        let lastSample = kSplineTableSize - 1;
        for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
            intervalStart += kSampleStepSize;
        }
        --currentSample;
        // Interpolate to provide an initial guess for t
        let dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
        let guessForT = intervalStart + dist * kSampleStepSize;
        let initialSlope = getSlope(guessForT, mX1, mX2);
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
    return (x) => {
        if (x === 0 || x === 1)
            return x;
        return calcBezier(getTForX(x), mY1, mY2);
    };
}
;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ slickScroll)
/* harmony export */ });
/* harmony import */ var _momentumScroll_main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./momentumScroll/main */ "./src/momentumScroll/main.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/**************************************
*            SlickScrollJS
*           © Musab Hassan
*
*       Build with 'npm run build'
*
***************************************/


class slickScroll {
    constructor() {
        // mometumScrolling
        this.momentumScroll = _momentumScroll_main__WEBPACK_IMPORTED_MODULE_0__.momentumScroll;
    }
    // The inView slickscroll function
    inView(element) {
        if (!element)
            return;
        if (NodeList.prototype.isPrototypeOf(element)) {
            console.warn("Multiple elements are not selectable at inView");
            return;
        }
        let e = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.selectNode)(element);
        let parent = scrollableParent(e);
        let parentViewTop = parent.getBoundingClientRect().top;
        let parentViewBottom = parentViewTop + parent.getBoundingClientRect().height;
        var elemTop = e.getBoundingClientRect().top;
        var elemBottom = elemTop + (e.getBoundingClientRect().height);
        // Returns boolean on if element is in view or not
        return (((elemBottom <= parentViewBottom) && (elemTop >= parentViewTop)) &&
            ((elemBottom > 0) && (elemTop <= window.innerHeight)));
        // Go through parent list to find first scrollable parent
        function scrollableParent(e) {
            if (e == null)
                return document.body;
            let overflow = window.getComputedStyle(e).getPropertyValue('overflow');
            if (e.scrollHeight > e.clientHeight && overflow != "visible" && overflow != "hidden")
                return e;
            return scrollableParent(e.parentNode);
        }
    }
}

})();

slickScroll = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=build.js.map