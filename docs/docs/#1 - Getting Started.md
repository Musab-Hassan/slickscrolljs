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

<blockquote><strong>
    WARNING:
    Event listeners should be added after momentumScroll has been initialized. Since the DOM is restructured, all event listeners within the root element will be destroyed on initialization.
</strong></blockquote>
<br>

### Destroy
Created instances of momentumScroll can be destroyed and the root can be reverted to its original state.

```javascript
let instance = slick.momentumScroll({
    root: "body",
    ...
});

instance.destroy(true);
```

The destroy function takes one boolean argument, `fullDestroy`. Both true and false will destroy the instance and remove all transformations and listeners. **However, setting `fullDestroy` to true will also revert the DOM structure of the root element back to its original state destroying all event listeners inside the root element. False will keep the DOM as is and will preserve the event listeners added.**


Next Suggested document.
#### **#2 - Offsets**

