# Offsets

SlickScroll supports both momentum scrolling and parallax scrolling. Offsets allow the scrolling speed of elements to be changed allowing parallax scrolling.

<blockquote>
Parallax scrolling is when some elements move slower than others giving the illusion of depth allowing a webpage to look 3 dimensional without actually containing anything 3D.
</blockquote><br>

The [slickscroll webpage](https://slickscroll.musabhassan.com) demonstrates parallax scrolling with the slower images in the back.

Let's take a look at an example that demonstrates how to setup offsets.

Let's take the following markup.
```html
<body>
    <div id="back-image">...</div>
    <div class="content">
        SlickScroll offsets guide
    </div>
</body>
```

To give the `#back-image` element 80% of the vertical scrolling speed, we use the following options.

```javascript
slickScroll.momentumScroll({
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

**Note: The offset element must be inside the root element for the speed to be correct. In the example above, `#back-image` is inside the `body`.**


# Fixed Offsets
Since slickScroll's momentum scrolling transforms the root element, fixed elements inside the root element no longer work. To fix this, fixedOffsets can be used.

Let's take a look at an example.

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
slickScroll.momentumScroll({
    root: "body",
});
```
In this example, the fixed `#nav-bar` will not stay fixed as it is inside the moving root element. To make it fixed, we must make it a fixedOffset. Here is the correct way of making `#nav-bar` fixed.

```javascript
slickScroll.momentumScroll({
    root: "body",
    fixedOffets: [
        "#nav-bar"
    ]
});
```
Now `#nav-bar` will behave like a `position: fixed` element.

# Dynamically Adding Offsets
Offsets and fixedOffsets can also be added after initialization dynamically. They can also be removed if no longer needed.

In this example we have momentumScroll with default options on the body.
```javascript
let scrollObj = slickScroll.momentumScroll({
    root: "body",
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
If we want to make the `#back-image` to an offset and the `#nav-bar` a fixedOffset later somewhere, we can just add them dynamically.

To add `#back-image` as an offset dynamically we use
```javascript
scrollObj.addOffset({
    element: "#back-image",
    speedY: 0.8
})
```
To add `#nav-bar` as a fixedOffset dynamically we use
```javascript
scrollObj.addFixedOffset("#nav-bar");
```

Now that the elements have been added as offsets dynamically, they behave just like offsets added during initialization. We can also remove offsets and fixedOffsets using `removeOffset()`.

Lets remove both `#nav-bar` from fixedOffsets and `#back-image` from offsets. To remove both fixedOffsets and offsets, we use the same function.

```javascript
scrollObj.removeOffset("#nav-bar");
scrollObj.removeOffset("#back-image");
```



# Quick Overview

### Offsets

The structure of the offsets option
```javascript
let scrollObj = slickScroll.momentumScroll({
    offsets: [
        {
            element: String, // Element name
            speedX: Number, // % of root horizontal scroll
            speedY: Number // % of root vertical scroll speed
        }
    ]
})
```
Offsets can be added dynamically after intialization through `addOffset()`.
```javascript
scrollObj.addOffset({
    element: String, 
    speedX: Number,
    speedY: Number
})
```

### Fixed Offsets

The structure of the fixedOffsets option
```javascript
let scrollObj = slickScroll.momentumScroll({
    fixedOffsets: [
        String // Element name
    ]
})
```
Fixed offsets can be added dynamically after initialization through `addFixedOffset()`.
```javascript
scrollObj.addFixedOffset(String); /* Element name */
```

Both offsets and fixedOffsets can be removed dynamically through
```javascript
scrollObj.removeOffest(String); /* Element name */
```


Next Suggested document.
#### **#3 - Easing & Timing**