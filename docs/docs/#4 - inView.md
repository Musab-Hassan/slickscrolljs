# inView

As an added bonus, slickScroll also offers the `inView` function. The inView function is a callable function that returns either a true or false depending on if an element is visible in it's first scrollable parent's viewport or not.

It can be called on its own
```javascript
if (slick.inView(".link")) {
    ...
}
```
or combined with a scroll event
```javascript
let body = document.querySelector("body");

body.addEventListener("scroll", () => {
    if (slick.inView(".link")) {
        ...
    }
})
```

## onScroll

The `momentumScroll` function also has a built-in `onScroll` event which can be set during initialization making it a shorter way of adding a scroll event on the root element.

```javascript
slick.momentumScroll({
    root: "body",
    onScroll: function(e) {
        ... //Whenever user scrolls in the root (body)
    }
})
```

The `momentumScroll` function can also be combined with the `inView` function to always check if an element is `inView` or not.
```javascript
slick.momentumScroll({
    root: "body",
    onScroll: () => {
        if (slickScroll.inView("#button")) {
            ...
        } else {
            ...
        }
    }
})
```

# Quick Overview

#### **inView**
The `inView` function checks if an element is in its first scrollable parent's viewport and returns a Boolean.

```javascript
slickScroll.inView(String) // Element name
```

#### **onScroll**

The `momentumScroll` function contains a `onScroll` event for setting up a quick scroll event on the root element.

```javascript
slickScroll.momentumScroll({
    onScroll: Function // Function to run when scrolling
})
```