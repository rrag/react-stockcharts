
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

### Props

| props            | type          | default   | Description  |
|------------------|:--------------|:----------|:-------------|
| className        | string        | "line"    |
| strokeWidth      | number        | 1         |
| stroke           | string        | "#4682B4" |
| hoverStrokeWidth | number        | 4         |
| fill             | string        | "none"    |
| hoverTolerance   | number        | 6         |
| highlightOnHover | boolean       | false     |
| connectNulls     | boolean       | false     | Whether to connect a graph line across null points.
| yAccessor        | function      |           |
| onClick          | function      |           |
| onDoubleClick    | function      |           |
| onContextMenu    | function      |           |
| defined          | function      |           |

[source](https://github.com/rrag/react-stockcharts/blob/master/docs/lib/charts/LineAndScatterChart.jsx), [block](http://bl.ocks.org/rrag/95ffd539fa4e0b4544cf), [plunker](http://plnkr.co/edit/gist:95ffd539fa4e0b4544cf?p=preview)
