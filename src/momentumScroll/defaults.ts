
/* Default values and properties for momentumScroll */


// Default properties for momentumScrollStruct
export var defaults: { root: any, duration: number, easing: string, offsets: any[], fixedOffsets: any[] } = {
    root: "body",
    duration: 1000,
    easing: "cubic-bezier(0.15, 1, 0.4, 1)",
    offsets: [],
    fixedOffsets: []
}

// Default offset speeds
export var defaultSpeeds: { speedY: number, speedX: number } = {
    speedY: 1,
    speedX: 1
}

// Default pennerEasings
export var pennerEasings: { name: string, value: number[] } [] = [
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