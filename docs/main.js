document.addEventListener('DOMContentLoaded', () => { 
    slickScroll.momentumScroll({
        root: "body",
        duration: 1000,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        offsets: [{
            element: ".slow-parallax",
            speedY: 0.8
        }, {
            element: ".faster-parallax",
            speedY: 0.7
        }],
        fixed: [
            ".nav-container"
        ]
    });
}, false);
