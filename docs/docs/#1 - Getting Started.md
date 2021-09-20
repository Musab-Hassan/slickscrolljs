# Getting Started

Momentum scrolling is achieved through the `slickScroll.momentumScroll` function.

```javascript
slickScroll.momentumScroll(options);
```

Full details about the momentumScroll function can be found in *momentumScroll*.

Momentum scrolling is initialized by using the  momentumScroll function. Here is an example to apply the default momentum scrolling to the body. 

```javascript
// See README on how to import slickscroll
let slick = new slickScroll;

let instance = slick.momentumScroll({
    root: "body"
});
```
The root option specifies the element to contain the momentum scrolling within.

*Note: the function will override the overflow property. Overflow must be changed again after initialization by modifying inline styles of the root. The following overflowX modification can only be done after initialization of momentumScroll*
```javascript
document.querySelector("body").style.overflowX = "hidden";
```

<br>

### Destroy
Instances of momentumScroll can be destroyed, removing the momentum scrolling effect and reverting the root to its original state.

```javascript
let instance = slick.momentumScroll({
    root: "body",
    ...
});

instance.destroy();
```

Next Suggested document.
#### **#2 - Offsets**

