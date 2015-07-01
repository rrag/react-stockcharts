### Installation
```sh
npm install react-stockcharts --save
```

### Bootstrap
```sh
mkdir stockchart
cd stockchart
git clone https://gist.github.com/b13b739458e65ff93f4a.git
npm install react-stockcharts
```
edit the `index.html` to use the below instead of the existing one there

```html
<script src="node_modules/dist/react-stockcharts.min.js"></script>
```
You should be good to go

---
#### React version compatibility
The library is tested with React 0.13.3 and React 0.14

When used with 0.13.x you get a warning 

```
Warning: withContext is deprecated and will be removed in a future version. Use a wrapper component with getChildContext instead.
```

It is ok, This is the only way to make the project work with both 0.13 & 0.14 with minimal code differences. React 0.14 includes [this](https://github.com/facebook/react/issues/2112) which eliminates the need for using `withContext`

Checkout some live examples on plunkr from the [quick start](#/QuickstartExamples) page, change to use 0.14 alpha and see that warning disappear


Context is an undocumented feature in React, it is [explained](https://facebook.github.io/react/blog/2014/03/28/the-road-to-1.0.html#context) that contexts are not going away and will be available in 1.0
