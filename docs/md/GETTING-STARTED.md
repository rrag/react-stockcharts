### Installation
```
npm install react-stockcharts --save
```

### Bootstrap
```
mkdir stockchart
git clone https://gist.github.com/a27298bb7ae613d48ba2.git stockchart
cd stockchart
npm install react-stockcharts
```
edit the `index.html` to use the below 

```html
<script type="text/javascript" src="node_modules/react-stockcharts/dist/react-stockcharts.js"></script>
```

instead of

```html
<script type="text/javascript" src="//rrag.github.io/react-stockcharts/dist/react-stockcharts.js"></script>
```

You should be good to go

---
#### React version compatibility
The library is tested with React `0.13.3` and React `0.14.0-rc1`

When used with `0.13.3` you get a warning 

```
Warning: withContext is deprecated and will be removed in a future version. Use a wrapper component with getChildContext instead.
```

It is ok, This is the only way to make the project work with both 0.13 & 0.14 with minimal code differences. React 0.14 includes [this](https://github.com/facebook/react/issues/2112) which eliminates the need for using `withContext`

Checkout some live examples on plunkr from the [quick start](#/quick_start_examples) page, change to use 0.14 and see that warning disappear

Context is an undocumented feature in React, it is [explained](https://facebook.github.io/react/blog/2014/03/28/the-road-to-1.0.html#context) that contexts are not going away and will be available in React 1.0

When used with `0.14.0-rc1` you get a warning

```
Warning: React.findDOMNode is deprecated. Please use ReactDOM.findDOMNode from require('react-dom') instead.
```

Once 0.14 becomes available, a new version will be release to address these warnings and the dependency of this project will also be upgraded to `0.14.0`