/*             utils.ts                 */
/* Globally accessible helper functions */

import { pennerEasings } from "./momentumScroll/defaults";


// Initalize an array of fixedOffsets or offsets
export function setOffsetArray(array: any[], id: any, data?: any[]) {
    let itemArr: { element: any, items: any[] }[] = array.filter(obj => obj.element == id);
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
export function pushToOffsetArray(array: any[], id: any, data?: any) {
    let index = array.findIndex(obj => obj.element == id);
    array[index].items.push(data);
}


// Remove specific offset from fixedOffsets or offsets
export function removeFromOffsetArray(array: any[], item: any) {
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
export function getFromOffsetArray(array: any[], id: any) {
    let item = array.filter(obj => obj.element == id);
    return item[0].items;
}


// Select the node if a query string is provided
export function selectNode(elem: any, multiple?: boolean) {
    // return node if element is string
    if (typeof elem == "string") {
        if (multiple) {
            return <any>document.querySelectorAll(elem);
        } else {
            return <any>document.querySelector(elem);
        }
    } else {
        // return elem itself if already a node
        return elem;
    }
}

// Converts CSS bezier string to bezier floats
export function parseBezierString(bezierString: any) {
    let valObj = pennerEasings.filter(e => e.name == bezierString);
    let vals: [mX1: number, mY1: number, mX2: number, mY2: number];
    if (valObj[0]) {
        vals = <[mX1: number, mY1: number, mX2: number, mY2: number]>valObj[0].value;
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






// ES6 version of gre/bezier-easing 
// https://github.com/gre/bezier-easing/blob/master/src/index.js
export function bezierEasing(mX1: number, mY1: number, mX2: number, mY2: number) {

    let newton_iterations = 4;
    let newton_min_slope = 0.001;
    let subdivision_precision = 0.0000001;
    let subdivision_max_iterations = 10;

    let kSplineTableSize = 11;
    let kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

    let float32ArraySupported = typeof Float32Array === 'function';

    function A(aA1: number, aA2: number) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }

    function B(aA1: number, aA2: number) { return 3.0 * aA2 - 6.0 * aA1; }

    function C(aA1: number) { return 3.0 * aA1; }

    function calcBezier(aT: number, aA1: number, aA2: number) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }

    function getSlope(aT: number, aA1: number, aA2: number) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

    function binarySubdivide(aX: number, aA: number, aB: number, mX1: number, mX2: number,) {
        let currentX, currentT, i = 0;
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

    function LinearEasing(x: number) { return x; }

    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
        throw new Error('bezier x values must be in [0, 1] range');
    }

    if (mX1 === mY1 && mX2 === mY2) return LinearEasing;

    let sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
    for (let i = 0; i < kSplineTableSize; ++i) {
        sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
    }

    function getTForX(aX: number) {
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