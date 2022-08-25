/**************************************
*            SlickScrollJS
*           © Musab Hassan
*
*       Build with 'npm run build'
*
***************************************/


import { DOMRestructure, selectNode, bezierEasing, parseBezierString, isCompatible } from "./utils";
import { defaults, defaultSpeeds } from "./defaults";
import { momentumScrollStruct } from "./struct";


export default class slickScroll {

    #params: momentumScrollStruct;

    #pl: { x: number, y: number };
    #lastLocation: { x: number, y: number };
    #startStamp: number;

    #restructedElements: any;
    #rootElement: any;
    #mutationObserver: MutationObserver;

    #fixedOffsets: any[] = [];
    #offsets: any[] = [];

    #isDestroyed: boolean;
    

    constructor(params: momentumScrollStruct) {
        // Assign defaults to params object
        this.#params = (<any>Object).assign({}, defaults, params);

        this.#rootElement = selectNode(params.root);

        // Set any offsets or fixedOffsets assigned on initialization
        this.#fixedOffsets = params.fixedOffsets;
        this.#offsets = params.offsets;

        // Switch to mobile version of client is unsupported
        if (isCompatible()) {
            this.#init();
        } else {
            this.#mobileFallback();
        }
    }


    // Initialize momentum scrolling
    #init() {

        this.#restructedElements = DOMRestructure(this.#rootElement);
        let matrix = new WebKitCSSMatrix(window.getComputedStyle(this.#restructedElements.fixed).transform);
        this.#lastLocation = { x: matrix.m41, y: matrix.m42 }
        
        // Detect any changes to root element's appearance by listening to window resize and DOM tree changes
        this.#mutationObserver = new MutationObserver(this.#onWindowResize);
        this.#mutationObserver.observe(this.#rootElement, {
            childList: true,
            attributes: true,
            subtree: true
        });
        window.addEventListener("resize", this.#onWindowResize);

        // Bind scroll handler
        this.#rootElement.addEventListener("scroll", this.#scrollHandler);
    }


    // Change values based on scroll position
    #scrollHandler = (e: any) => {
        
        // Get scroll position of rootElement
        this.#pl = { x: this.#rootElement.scrollLeft, y: this.#rootElement.scrollTop };

        if (typeof this.#pl.x === "undefined" || typeof this.#pl.y === "undefined") {
            this.#pl = { x: this.#rootElement.scrollX, y: this.#rootElement.scrollY, };
        }

        // Store time for timing animations
        this.#startStamp = Date.now();

        // Scroll Animation Frame Handler for easing
        this.#animate(this.#lastLocation, this.#pl, this.#startStamp, (position: { x: number, y: number }) => {

            let translateString = `translate3d(${position.x}px, ${position.y}px, 0px)`;
            this.#restructedElements.fixed.style.webkitTransform = translateString;
            this.#restructedElements.fixed.style.transform = translateString;

            this.#lastLocation = position;

            // Parallax offset elements scrolling
            if (Array.isArray(this.#offsets)) {

                for (let i = 0; i < this.#offsets.length; i++) {

                    let e = Object.assign({}, defaultSpeeds, this.#offsets[i]);
                    let offset = `translate3d(${position.x * (e.speedX - 1)}px, ${position.y * (e.speedY - 1)}px, 0)`;
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

            // Set fixedOffsets position as fixed
            if (Array.isArray(this.#fixedOffsets)) {

                for (let i = 0; i < this.#fixedOffsets.length; i++) {
                    let offset = `translate3d(${-position.x}px, ${-position.y}px, 0px)`;
                    let node = selectNode(this.#fixedOffsets[i], true);

                    if (NodeList.prototype.isPrototypeOf(node)) {
                        for (let e of node as any) {
                            e.style.webkitTransform = offset;
                            e.style.transform = offset;
                        }
                    } else {
                        node.style.webkitTransform = offset;
                        node.style.transform = offset;
                    }
                }
            }
        });

        // Run params.onScroll function asynchrounously
        if (this.#params.onScroll) {
            new Promise(r => {
                this.#params.onScroll(e);
                r(true);
            })
        }
    }


    // Tween between scroll position (momentum scrolling)
    #animate(
        tl: { x: number, y: number },
        pl: { x: number, y: number },
        startStamp: number, 
        onIterate: (position: { x: number, y: number }) => void
    ) {
        // Parse bezier easing string into number values
        let easing = parseBezierString(this.#params.easing);

        let diffX = ((tl.x * -1) - pl.x);
        let diffY = ((tl.y * -1) - pl.y);
        let x: number, y: number;

        let duration = this.#params.duration;

        // Animation frame loop
        const loop = () => {

            if (this.#isDestroyed) return;

            let t = (Date.now() - startStamp) / duration!;

            if (t > 1) t = 1.01;
            if (t < 1) {
                x = (diffX * bezierEasing.apply(null, easing)(t)) + tl.x;
                y = (diffY * bezierEasing.apply(null, easing)(t)) + tl.y;

                x = Math.ceil(x * 100) / 100;
                y = Math.ceil(y * 100) / 100;
                
                new Promise(r => {
                    onIterate({ x: x, y: y });
                    r(true);
                });

                window.requestAnimationFrame(() => loop());
            }
        };

        loop();
    }

    // Mobile version without momentum scrolling, just parallax offset support
    #mobileFallback() {

        // Parallax Offsets scrolling
        this.#rootElement.addEventListener("scroll", (event: any) => {

            // Offset elements scrolling
            if (this.#offsets) {
                this.#offsets.forEach((e: any) => {
                    e = Object.assign({}, defaultSpeeds, e);

                    let offset = `translate3d(${event.target.scrollLeft * (1 - e.speedX)}px, ${event.target.scrollTop * (1 - e.speedY)}px, 0px)`;
                    let nodes = selectNode(e.element, true);

                    if (Symbol.iterator in Object(nodes)) {
                        // If multiple nodes are selected
                        for (let e of nodes as any) {
                            e.style.webkitTransform = offset;
                            e.style.transform = offset;
                        }
                    } else {
                        // If single node is selected
                        nodes.style.webkitTransform = offset;
                        nodes.style.transform = offset;
                    }
                });
            }
        });

        // Set fixed offsets as just fixed 
        if (this.#fixedOffsets) {
            this.#fixedOffsets.forEach((element: any) => {
                let nodes = selectNode(element, true);

                if (Symbol.iterator in Object(nodes)) {
                    // If multiple nodes are selected
                    for (let e of nodes as any) {
                        e.style.position = "fixed";
                    }
                } else {
                    // If single node is selected
                    nodes.style.position = "fixed";
                }
            });
        }
    }


    // Resize dummy element when window resizes to prevent overscrolling
    #onWindowResize = () => {
        if (this.#restructedElements === undefined) return;
        this.#restructedElements.dummy.style.height = this.#restructedElements.fixed.scrollHeight + "px";
    }



    // ? Public Methods

    // Remove all slickScroll handers and return rootelement's DOM tree to its original state
    destroy() {
        
        let wrapper: any = this.#rootElement.querySelector("._SS_wrapper");

        // Remove all Observers and EventListeners
        this.#rootElement.removeEventListener("scroll", this.#scrollHandler);
        this.#rootElement.removeEventListener("resize", this.#onWindowResize);
        this.#mutationObserver.disconnect();

        // Revert root element to original state and remove all slickscroll classes
        for (let i = wrapper.children.length; i > 0; i--) {
            if (wrapper.children[i - 1].removeProperty) wrapper.children[i - 1].removeProperty("transform");
            this.#rootElement.insertBefore(wrapper.children[i - 1], this.#rootElement.children[0]);
        }
        wrapper.remove();

        selectNode(this.#params.root).querySelector("._SS_dummy")!.remove();
        this.#rootElement.style.removeProperty("overflow");
        this.#rootElement.style.removeProperty("position");

        this.#isDestroyed = true;

        // Clear all transformations on offsets
        clearTransform(this.#offsets);
        clearTransform(this.#fixedOffsets);

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

    // Disable and remove a fixed or parallax Offset
    removeOffset(offset: string | HTMLElement | HTMLBodyElement | null) {
        this.#offsets = this.#offsets.filter(item => item.element !== offset);
        this.#offsets = this.#offsets.filter(item => item.element !== selectNode(offset, true));
        this.#fixedOffsets = this.#fixedOffsets.filter(item => item !== offset);
        this.#fixedOffsets = this.#fixedOffsets.filter(item => item !== selectNode(offset, true));

        let offsetNode = selectNode(offset, true);

        if (NodeList.prototype.isPrototypeOf(offsetNode)) {
            for (let e of offsetNode as any) {
                e.style.removeProperty("transform");
                e.style.removeProperty("-webkit-transform");
                if (e.style.position == "fixed") e.style.removeProperty("position");
            }
        } else {
            offsetNode.style.removeProperty("transform");
            offsetNode.style.removeProperty("-webkit-transform");
            if (offsetNode.style.position == "fixed") offsetNode.style.removeProperty("position");
        }
    }


    addOffset(offset: {
        element: string | HTMLElement | HTMLBodyElement | null,
        speedY?: number,
        speedX?: number
    }) {

        if (typeof offset !== "object") return;

        // Check if offset already exists
        const find = this.#offsets.find((i: any) => i.element == offset.element);
        if (find || !offset.element) {
            return;
        }

        // Assign default values to offset and push it to offsets array
        offset = Object.assign({}, defaultSpeeds, offset);
        this.#offsets.push(offset);
    }


    addFixedOffset(element: string | HTMLElement | HTMLBodyElement | null) {

        // Check if offset already exists
        if (!selectNode(element, true) || this.#fixedOffsets.includes(element)) {
            return;
        }

        this.#fixedOffsets.push(element);
    }
}