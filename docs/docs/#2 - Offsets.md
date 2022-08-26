# Offsets

SlickScroll supports both momentum scrolling and parallax scrolling. Offsets allow the scrolling speed of elements to be changed creating a parallax scrolling effect.

<blockquote>
Parallax scrolling is when some elements move slower than others giving the illusion of depth allowing a webpage to look 3 dimensional without actually containing anything 3D.
</blockquote><br>

The [slickscroll webpage](https://slickscroll.musabhassan.com) demonstrates parallax scrolling with the slower moving images in the back.

The following is an example that demonstrates how to setup offsets.

```html
<body>
    <div id="back-image">...</div>
    <div class="content">
        SlickScroll offsets guide
    </div>
</body>
```

To give the `#back-image` element 80% of the vertical scrolling speed, the following options can be used.

```javascript
new slickScroll({
    root: "body",
    offsets: [
       {
            element: "#back-image",
            speedY: 0.8 // Vertical speed
       }
    ]
})
```
The back image now moves slower than the content in front of it creating a parallax effect.

**Note: The offset element must be inside the root element for it to work correctly. In the example above, `#back-image` is inside the root element `body`.**


# Fixed Offsets
Since slickScroll's momentum scrolling transforms the root element, fixed elements inside the root element no longer work. For fixed elements use fixedOffsets.

Example:

```html
<body>
    <div id="nav-bar">...</div>
    <div class="content">
        SlickScroll fixed offsets guide
    </div>
</body>
```
```css
#nav-bar {
    position: fixed;
    ...
}
```
```javascript
new slickscroll({
    root: "body",
});
```
In this example, the fixed `#nav-bar` will not stay fixed as it is inside the moving root element. To make it fixed, it must be made a fixedOffset. The following is the correct way of making `#nav-bar` fixed.

```javascript
new slickScroll({
    root: "body",
    fixedOffets: [`
        "#nav-bar"
    ]
});
```
Now `#nav-bar` will behave like a `position: fixed` element.

# Dynamically Adding Offsets
Offsets and fixedOffsets can also be added after class initialization dynamically. They can also be removed if no longer needed.

In this example there is an instance of momentumScroll with default options on the body.
```javascript
let slick = new slickScroll({
    root: document.body,
});
```
with the following markup.
```html
<body>
    <div id="back-image">...</div>
    <div id="nav-bar">...</div>
    <div class="content">
        SlickScroll offsets guide
    </div>
</body>
```
If we want to make the `#back-image` an offset and the `#nav-bar` a fixedOffset later somewhere, we can just add them dynamically later.

To add `#back-image` as an offset dynamically, `addOffset` can be used:
```javascript
slick.addOffset({
    element: "#back-image",
    speedY: 0.8
})
```
To add `#nav-bar` as a fixedOffset dynamically, `addFixedOffset` can be used we use:
```javascript
slick.addFixedOffset("#nav-bar");
```

Elements that are added as offsets dynamically behave just like offsets added during initialization. Both fixedOffsets and offsets can also be removed with the `removeOffset` method.

To remove `#nav-bar` from fixedOffsets and `#back-image` from offsets, the `removeOffset` method can be used.

```javascript
slick.removeOffset("#nav-bar");
slick.removeOffset("#back-image");
```



# Quick Overview

### Offsets

The structure of the offsets option
```javascript
let slick = new slickScroll({
    offsets: [
        {
            element: String | DOMElement, // Element name
            speedX: Number, // % of root horizontal scroll speed
            speedY: Number // % of root vertical scroll speed
        }
    ]
})
```
Offsets can be added dynamically after intialization through `addOffset()`.
```javascript
slick.addOffset({
    element: String | DOMElement, 
    speedX: Number,
    speedY: Number
})
```

### Fixed Offsets

The structure of the fixedOffsets option
```javascript
let slick = new slickScroll({
    fixedOffsets: String[] | DOMElement[]
})
```
Fixed offsets can be added dynamically after initialization through `addFixedOffset()`.
```javascript
slick.addFixedOffset(String | DOMElement);
```

Both offsets and fixedOffsets can be removed dynamically through
```javascript
slick.removeOffest(String | DOMElement);
```


Next Document.
#### **#3 - Easing & Timing**