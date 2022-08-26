# Getting Started

Momentum scrolling is achieved by creating a new instance of `slickScroll`.

```javascript
// ES6
new slickScroll(options);
// ES5 & Node
new slickScroll.default(options);
```

For this documentation, the ES6 version will be used for examples however the same applies to ES5 and Node by just replacing `slickScroll` with `slickScroll.default`; 

Here is an example to apply slickscroll to the body. 

```javascript
let slick = new slickScroll({
    root: "body"
});
```
The root option specifies the element in which the scrolling will be animated.

*Note: the function will override the overflow property. Overflow must be changed again after initialization by modifying inline styles of the root. The following overflowX modification can only be done after initialization of slickscroll*
```javascript
document.querySelector("body").style.overflowX = "hidden";
```

<br>

### Destroy
Instances of slickscroll can be destroyed, removing the momentum scrolling effect and reverting the scroll behaviour to the browser default.

```javascript
let slick = new slickScroll({
    root: "body",
    ...
});

slick.destroy();
```

Next Document.
#### **#2 - Offsets**
