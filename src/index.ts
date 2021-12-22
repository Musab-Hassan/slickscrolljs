/**************************************
*            SlickScrollJS
*           © Musab Hassan
*
*       Build with 'npm run build'
*
***************************************/


import { momentumScroll } from "./momentumScroll/main";
import { selectNode } from "./utils";

export default class slickScroll {
    // mometumScrolling
    public momentumScroll = momentumScroll;


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