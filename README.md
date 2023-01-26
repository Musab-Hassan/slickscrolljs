<h1 align="center">
    <img src="/assets/Logo.png"/>
</h1>

Slickscroll is a JavaScript library that makes momentum & parallax scrolling quick and painless

[![NPM version](http://img.shields.io/npm/v/slickscrolljs.svg?style=for-the-badge&logo=npm)](https://www.npmjs.org/package/slickscrolljs) [![NPM license](http://img.shields.io/npm/l/slickscrolljs.svg?style=for-the-badge)](https://www.npmjs.org/package/slickscrolljs)

**View Demo: [slickscroll.musabhassan.com](https://slickscroll.musabhassan.com)**

<blockquote>
<strong><i>Momentum Scrolling</i></strong><br>
Momentum Scrolling is the smooth and eased scrolling fancy websites have to allow the page to flow smoothly when scrolling.
</blockquote><br>


## Download & Setup

### Download
Manually download from *Releases*, from the `dist` directory, or npm.

npm
```
npm install --save slickscrolljs
```

### Setup

This setup will just apply momentum scrolling to the body

ES6 import
```javascript
import slickScroll from './slickscroll.es.min.js';

const slick = new slickScroll({
    root: "body"
});
```

HTML script tag
```html
<script src="./slickscroll.min.js" type="text/javascript"></script>

<script type="text/javascript">

    let slick = new slickScroll.default({
        root: "body"
    });

</script>
```

Node require
```javascript
const slickScroll = require('slickscrolljs');

const slick = new slickScroll.default({
    root: "body"
});
```

## Hello World
The hello world will apply the momentum scrolling to the element you specify.
```javascript
new slickScroll({
    root: "body"
})
```
The overflow property of the `root` element will be overridden with `auto` upon initialization of slickscroll. If you wish to change overflow to anything else, you must modify it after the initialization.

Momentum scrolling applies to both x and y axis of an element. If you wish for an axis to not scroll, change it's overflow value to `hidden` after slickscroll initialization.

Example to hide overflow-x after initializing up slickscroll;

```javascript
const slick = new slickScroll.default({
    root: "body"
});

document.body.style.overflowX = "hidden";
```

All the valid options aswell as documentation and Getting Started can be found in the `docs` directory.

## Browser Support

Browser | Version
| - | - |
Chrome | 61+
Edge | 80+
IE | 11
Firefox | 48+
Opera | 48+
Safari | 12+

### Contributors
Musab-Hassan

### License
MIT license.
