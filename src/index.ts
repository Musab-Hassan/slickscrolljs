/**************************************
*            SlickScrollJS
*           © Musab Hassan
*
*       Build with 'npm run build'
*
***************************************/


import { momentumScroll } from "./momentumScroll/main";
import { inView } from "./inView/main"

export default class slickScroll {
    // mometumScrolling
    public momentumScroll = momentumScroll;

    public inView = inView;
}