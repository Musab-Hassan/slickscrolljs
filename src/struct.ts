
// MomentumScroll interface
export interface momentumScrollStruct {
    root: string | HTMLElement | HTMLBodyElement | null,
    easing?: string,
    duration?: number,
    fixedOffsets?: string[] | HTMLElement[] | NodeList[] | null[],
    offsets?: [{
        element: string | HTMLElement | NodeList | null,
        speedY?: number,
        speedX?: number
    }],
    onScroll?(func: () => any): any
}