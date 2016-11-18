
```js
import { ChartCanvas, Chart, series } from "react-stockcharts";

const { LineSeries, ScatterSeries, CircleMarker, SquareMarker, TriangleMarker } = series;
```

```jsx
<LineSeries yAccessor={d => d.AAPLClose} stroke="#ff7f0e" />
<ScatterSeries
    yAccessor={d => d.AAPLClose}
    marker={SquareMarker}
    markerProps={{ width: 6, stroke: "#ff7f0e", fill: "#ff7f0e" }} />

<LineSeries yAccessor={d => d.GEClose} stroke="#2ca02c" />
<ScatterSeries
    yAccessor={d => d.GEClose}
    marker={TriangleMarker}
    markerProps={{ width: 8, stroke: "#2ca02c", fill: "#2ca02c" }} />

<LineSeries yAccessor={d => d.close} />
<ScatterSeries
    yAccessor={d => d.close}
    marker={CircleMarker}
    markerProps={{ r: 3 }} />
```

[source](https://github.com/rrag/react-stockcharts/blob/master/docs/lib/charts/LineAndScatterChart.jsx), [block](http://bl.ocks.org/rrag/95ffd539fa4e0b4544cf), [plunker](http://plnkr.co/edit/gist:95ffd539fa4e0b4544cf?p=preview)
