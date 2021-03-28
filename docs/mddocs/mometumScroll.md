# momentumScroll
Allows momentumScrolling and scroll based parallax effects.

### Function Overview
```javascript
slickScroll.momentumScroll(options)
```

### Parameters

- options `Object` - *options for momentum scrolling*

    Name | Type | Required | Default | Description
    | - | - | - | - | - |
    root | *String* | Yes | `body` | Element to apply momentum scroll on
    easing | *String* | Yes | `cubicBezier()` | Easing function
    duration | *Number* | Yes | `1000` | Duration of easing in milliseconds
    fixedOffsets | *String[]* | No | - | Array of position:fixed elements
    offsets | *Object[]* | No | - | Array of elements with custom speeds (See ***#2-Offsets***)
    onScroll | *Function* | No | - | Scroll listener for root element

### Returns

- addOffset `Function` - *Add offset (element with custom speed)*
    
    **Parameters**
    - element `String` - *Element name to set as offset*

<br>

- addFixedOffset `Function` - *Add fixed offset (element with fixed position)*

    **Parameters**
    - element `String` - *Element name to be set as fixed offset*

<br>

- removeOffset `Function` - *Removes an offset or fixedOffset*

    **Parameters**
    - element `String` - *Element name to be removed*

<br>

- destroy `Function` - *Destroys instance of momentumScroll*

    **Parameters**
    - fullDestroy `Boolean` - *True reverts DOM back to original, false keeps it as is*
