
[source](https://github.com/rrag/react-stockcharts/blob/master/docs/lib/charts/CandleStickChartWithZoomPan.js), [codesandbox](https://codesandbox.io/s/github/rrag/react-stockcharts-examples2/tree/master/examples/CandleStickChartWithZoomPan)


Click and drag the axis, to zoom on y & x. Once y axis is zoomed you can pan the chart on both x & y axis. Reset the y axis domain with the "Reset y domain" button

`mousemove`, `pan` and `zoom` are enabled by default. To disable them you can use `mouseMoveEvent`, `panEvent` and `zoomEvent` props.

`clamp` prevents scrolling past the last data point, and is disabled by default. Supported values for clamp are `left`, `right`, or `both` for clamping one or both sides of the graph.

```jsx
<ChartCanvas
    ...
    mouseMoveEvent={true}
    panEvent={true}
    zoomEvent={true}
    clamp={false}
    ...
/>
```
