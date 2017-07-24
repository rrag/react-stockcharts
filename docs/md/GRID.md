[source](https://github.com/rrag/react-stockcharts/blob/master/docs/lib/charts/LineAndScatterChartGrid.js), [codesandbox](https://codesandbox.io/s/github/rrag/react-stockcharts-examples2/tree/master/examples/LineAndScatterChartGrid)


```js
const height = 400;
const width = 800;

var margin = {left: 70, right: 70, top:20, bottom: 30};
var gridHeight = height - margin.top - margin.bottom;
var gridWidth = width - margin.left - margin.right;

var showGrid = true;
var yGrid = showGrid ? { 
    innerTickSize: -1 * gridWidth,
    tickStrokeDasharray: 'Solid',
    tickStrokeOpacity: 0.2,
    tickStrokeWidth: 1
} : {};
var xGrid = showGrid ? { 
    innerTickSize: -1 * gridHeight
    tickStrokeDasharray: 'Solid',
    tickStrokeOpacity: 0.2,
    tickStrokeWidth: 1
} : {};
```


```jsx
<ChartCanvas 
    width={width} 
    height={height}
    margin={margin}
>
    <Chart id={1}>
        <XAxis
            axisAt="bottom"
            orient="bottom"
            {...xGrid}
        />
        <YAxis
            axisAt="right"
            orient="right"
            ticks={5}
            {...yGrid}
        />
```
