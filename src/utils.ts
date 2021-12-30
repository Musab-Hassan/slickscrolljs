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


// Checks for mobile & unsupported browsers
export function isCompatible() {
    let check = false;
    (function (a) { 
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substring(0, 4))) 
            check = true; 
    }) (navigator.userAgent || navigator.vendor);
    
    if (!check && CSS.supports) check = !CSS.supports("position", "sticky");
    return !check;
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