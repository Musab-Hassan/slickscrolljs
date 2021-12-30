
// The inView slickscroll function

import { selectNode } from "../utils";

export function inView(element: string | HTMLElement | NodeList | null) {

    if (!element) return;

    // TODO: add multiple elements support
    if (NodeList.prototype.isPrototypeOf(element!)) {
        console.warn("slickscroll.inView cannot select multiple elements"); 
        return;
    }
    let e = selectNode(element);

    // Legacy (very performance intensive)
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
}


function isLegacy() {
    if (!('IntersectionObserver' in window) &&
        !('IntersectionObserverEntry' in window) &&
        !('intersectionRatio' in window.IntersectionObserverEntry.prototype)) {
        
        return false
    } else {
        return true
    }
}

// Go through parent list to find first scrollable parent
function scrollableParent(e: any): any {
    if (e == null) return document.body;
    let overflow = window.getComputedStyle(e).getPropertyValue('overflow');

    if ((e.scrollHeight > e.clientHeight) && 
        overflow != "visible" && 
        overflow != "hidden")
        
        return e;

    return scrollableParent(e.parentNode);
}