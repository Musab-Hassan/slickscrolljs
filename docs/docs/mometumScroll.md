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
    root | *String \| HTMLElement* | Yes | `body` | Element to apply momentum scroll on
    easing | *String* | Yes | `cubicBezier()` | Easing function
    duration | *Number* | Yes | `1000` | Duration of easing in milliseconds
    fixedOffsets | *String[] \| HTMLElement[]* | No | - | Array of position:fixed elements
    offsets | *Object[]* | No | - | Array of elements with custom speeds (See ***#2-Offsets.md***)
    onScroll | *Function* | No | - | Scroll listener for root element

### Returns

- addOffset `Function` - *Add offset (element with custom speed)*
    
    **Parameters**
    - offset `Object` - *Refer to **#2-Offsets.md** *

        - element `String` | `HTMLElement` - *Element to be added as an offset*
        - speedX `Number` - *overflow-x speed (Optional)*
        - speedY `Number` - *overflow-y speed (Optional)*

<br>

- addFixedOffset `Function` - *Add fixed offset (element with fixed position)*

    **Parameters**
    - element `String` | `HTMLElement` - *Element to be added as a fixed offset*

<br>

- removeOffset `Function` - *Removes an offset or fixedOffset*

    **Parameters**
    - element `String` | `HTMLElement`  - *Offset name or node to be removed*

<br>

- destroy `Function` - *Destroys instance of momentumScroll*
