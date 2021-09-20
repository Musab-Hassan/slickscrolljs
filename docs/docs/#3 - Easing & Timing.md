# Easing
The momentumScroll function's timing and easing can also be changed. SlickScroll uses the same timing and easing functions as the CSS transform property.

### Easing

Slickscroll supports cubic beziers and the Penner Easing functions for easing.

The default easing function is `cubicBezier(0.15, 1, 0.4, 1)`. It can be changed by modifying the easing option.

```javascript
slick.momentumScroll({
    root: "body",
    easing: "easeInOutSine"
})
```

Cubic beziers can also be used.
```javascript
slick.momentumScroll({
    root: "body",
    easing: "cubicBezier(.56, .09, .89, .29)",
})
```

### Penner Functions

List of Penner functions slickScroll supports:

Ease In | Ease Out | Ease In Out
| - | - | - |
easeInSine | easeOutSine | easeInOutSine
easeInQuad | easeOutQuad | easeInOutQuad
easeInCubic | easeOutCubic | easeInOutCubic
easeInQuart | easeOutQuart | easeInOutQuart
easeInQuint | easeOutQuint | easeInOutQuint
easeInExpo | easeOutExpo | easeInOutExpo
easeInCirc | easeOutCirc | easeInOutCirc


# Timing

Along with easing, the duration can also be changed to modify the scroll speed. 

The default duration is 1000 ms. To set a different duration, the `duration` option can be changed with a value in milliseconds.

In this example, the duration is set to 2.5 seconds.
```javascript
slick.momentumScroll({
    root: "body",
    duration: 2500
});
```


# Quick Overview

Easings can be modified through the `easing` option. 

```javascript
slickScroll.momentumScroll({
    easing: String // Penner function name or bezier curve
});
```
Default value: `cubicBezier(0.15, 1, 0.4, 1)`

The scroll animation duration can be modified with the `duration` option. 

```javascript
slickScroll.momentumScroll({
    duration: Number // Time in miliseconds
)};
```
Default value: `1000`

Next Suggested document.
#### **#4 - inView**
