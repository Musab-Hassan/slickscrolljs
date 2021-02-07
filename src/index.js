// Defaults incase of empty properties
const defaults = {
    root: "body",
    timing: 1000,
    easing: "cubic-bezier(0.15, 1, 0.4, 1)",
}

// SlickScroll
const _SS = {
    momentumScroll: function(dataObj) {
        let locationX, locationY;

        // Set unset properties to defaults
        dataObj = Object.assign({}, defaults, dataObj);

        document.querySelector(dataObj.root).onscroll = (e) => {
            if (dataObj.onScroll) dataObj.onScroll(e);
            
            
        }
    },
}
