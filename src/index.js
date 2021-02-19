/**************************************
*          # SlickScrollJS #
*
*          Copyright (2021)
*            Musab Hassan
*
*    https://github.com/Musab-Hassan/
*
***************************************/



// Defaults in case of empty properties
const defaults = {
    root: "body",
    duration: 1000,
    easing: "cubic-bezier(0.15, 1, 0.4, 1)",
}

// It's the const, the myth, the legend, SlickScroll
const _SS = {
    momentumScroll: function(dataObj) {
        let pl, startStamp;
        let rootElem = document.querySelector(dataObj.root);
        let fixedElem = restructure(rootElem);

        // Set unset properties to defaults
        dataObj = Object.assign({}, defaults, dataObj);

        // Scroll Event on root element
        rootElem.onscroll = function(e) {
            if (dataObj.onScroll) dataObj.onScroll(e);

            pl = {y: rootElem.scrollTop, x: rootElem.scrollLeft }
            
            let style = window.getComputedStyle(fixedElem.fixed);
            let matrix = new WebKitCSSMatrix(style.transform);
            let tl = {x: matrix.m41, y: matrix.m42}

            startStamp = Date.now();

            // Apply transform on children based on calculated value
            easeFrames(tl, pl, startStamp, dataObj, (position) => {
                translate = `translate(${position.x}px, ${position.y}px)`;
                fixedElem.fixed.style.webkitTransform = translate;
                fixedElem.fixed.style.transform = translate;

                // Offset elements scrolling
                if (dataObj.offsets) {
                    const defaultSpeed = {speedX: 1, speedY: 1};
                    
                    dataObj.offsets.forEach((e) => {
                        e = Object.assign({}, defaultSpeed, e);
                        
                        let offset = `translate(${position.x * (e.speedX - 1)}px, ${position.y * (e.speedY - 1)}px)`;
                        element = document.querySelector(e.element);
                        
                        if (element) {
                            element.style.webkitTransform = offset;
                            element.style.transform = offset;
                        }
                    });
                }
            });
        }
    },
}

// Adds fixed transformable child element to the root element
function restructure(root) {

    // Make sure root doesnt already have a position
    if (root.style.position != "absolute" || root.style.position != "fixed") {
        root.style.position = "relative";
    }

    let child = document.createElement('div');
    let dummy = document.createElement('div');
    let width = 0;
    let height = 0;

    child.classList.add("_SS_wrapper");
    dummy.classList.add("_SS_dummy");
    
    for (const e of root.children) {
        width = (width < e.offsetWidth) ? e.offsetWidth : width;
        child.appendChild(e.cloneNode(true));
    }

    root.innerHTML = "";
    root.style.overflow = "auto";
    root.appendChild(child);
    root.appendChild(dummy);

    // Dummy Scroll element to allow overflow to appear
    dummy.style.height = child.offsetHeight + "px";
    dummy.style.width = width + "px";
    dummy.style.top = "0px";
    dummy.style.left = "0px";
    dummy.style.position = "absolute";
    dummy.style.zIndex = "-9999";

    // Content inside the root element
    child.style.zIndex = "1";
    child.style.height = "100%";
    child.style.width = "100%";
    child.style.top = "0px";
    child.style.left = "0px";
    child.style.position = "sticky";

    return {
        fixed: root.querySelector("div._SS_wrapper"),
        dummy: root.querySelector("div._SS_dummy")
    };
}


// Provides calculated value for transforming based on scroll position
function easeFrames(tl, pl, startStamp, dataObj, onIterate) {
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

            // Fix JS Rounding
            dx = Math.ceil(dx * 100) / 100;
            dy = Math.ceil(dy * 100) / 100;
            onIterate({x: dx, y: dy});

            window.requestAnimationFrame(loop);
        }
    }());
}

// Bezier String Parser
function parseBezier(bezierString) {
    bezierString = bezierString.split(/([^\(-\)]*)/);
    bezierString = bezierString[3].split(/,(?![^()]*\()/);
    return bezierString.map((x) => { return parseFloat(x) });
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
