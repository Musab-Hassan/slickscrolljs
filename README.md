# SlickScroll

Slickscroll is a JavaScript library that makes momentum & parallax scrolling quick and painless

[slickscroll.musabhassan.com](https://slickscroll.musabhassan.com)

<blockquote>
<strong><i>Momentum Scrolling</i></strong><br>
Momentum Scrolling is the smooth and eased scrolling fancy websites have to allow the page to flow better when scrolling.
</blockquote><br>


## Download & Setup 
<br>

### Download
Manually download from *Releases* or from the `dist` directory.

### Setup

ES6
```javascript
import slickScroll from 'slickscroll.es.min.js';
```

Traditional require
```javascript
const slickScroll = require('slickscroll');
```

HTML script tag
```html
<script src="slickscroll.min.js"></script>
```

## Hello World
The hello world will apply the default momentum scrolling to the element you specify.
```javascript
slickScroll.momentumScroll({
    root: "body"
})
```
Warning: The overflow property will be overridden with `auto`. If you wish to change overflow, you must modify it after the hello world. Here is an example to hide overflow-x.
```javascript
slickScroll.momentumScroll({
    root: "body"
});

document.querySelector("body").style.overflowX = "hidden";
```

## Documentation
Complete documentation and Getting Started can be found in the `docs` folder or on the [webdocs](https://slickscroll.musabhassan.com/webdocs)



## Browser Support

TODO: Add browser support info. I know it works in Chrome.

## About
This repository is licensed under the MIT license.

Copyright (2021) [Musab Hassan]("musabhassan.com")