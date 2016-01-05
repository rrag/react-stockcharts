---
Below is an example of using `ScatterSeries` on top of an `AreaSeries`.

Include

```jsx
<ScatterSeries marker={Circle} markerProps={{ r: 3 }} />
```

inside the `DataSeries` containing the `AreaSeries` where

```jsx
var { ScatterSeries, Circle } = ReStock.series;
```
