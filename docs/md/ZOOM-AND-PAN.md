
## <span style="color:steelblue">Click on the chart to focus it, and then zoom by mouse scroll, pan by dragging the chart</span>

[source](https://github.com/rrag/react-stockcharts/blob/master/docs/lib/charts/CandleStickChartWithZoomPan.jsx), [block](http://bl.ocks.org/rrag/a8465abe0061df1b7976), [plunker](http://plnkr.co/edit/gist:a8465abe0061df1b7976?p=preview)


`MouseMove`, `Pan` and `Zoom` are enabled by default. To disable them you can use `disableMouseMoveEvent`, `disablePanEvent` and `disableZoomEvent` props.

```jsx
<ChartCanvas 
    ...
    disableMouseMoveEvent={false}
    disablePanEvent={false}
    disableZoomEvent={false}
    ...
/>
```
