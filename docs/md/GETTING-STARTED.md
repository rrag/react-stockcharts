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
edit the `index.html` and replace

```html
<script type="text/javascript" src="//unpkg.com/react-stockcharts@latest/dist/react-stockcharts.min.js"></script>
```

with

```html
<script type="text/javascript" src="node_modules/react-stockcharts/dist/react-stockcharts.js"></script>
```

You should be good to go

---
#### React version compatibility

As of `v0.4.x` react-stockcharts depends on React `^0.14.6`