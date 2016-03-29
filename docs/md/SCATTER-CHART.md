```jsx
<LineSeries yAccessor={d => d.close}/>
<ScatterSeries marker={Circle} markerProps={{ r: 3 }} />
```

where
```jsx
var { LineSeries, ScatterSeries, Circle } = ReStock.series;
```

[source](https://github.com/rrag/react-stockcharts/blob/master/docs/lib/charts/LineAndScatterChart.jsx), [block](http://bl.ocks.org/rrag/95ffd539fa4e0b4544cf), [plunker](http://plnkr.co/edit/gist:95ffd539fa4e0b4544cf?p=preview)
