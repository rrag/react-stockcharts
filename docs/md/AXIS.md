[source](https://github.com/rrag/react-stockcharts/blob/master/docs/lib/charts/ChartWithAxis.js)


```js
import { XAxis, YAxis } from "react-stockcharts/lib/axes";

```

```jsx
<ChartCanvas ...>
	<Chart id={1}
			yExtents={[d => [d.high, d.low]]}>
		<XAxis axisAt="bottom" orient="bottom" />
		<XAxis axisAt="top" orient="top" />
		<YAxis axisAt="right" orient="right" />
		<YAxis axisAt="left" orient="left" />
	</Chart>
</ChartCanvas>
```
Props on `XAxis`

| props            | type          | default   | Description  |
|------------------|:--------------|:----------|:-------------|
| axisAt        | one of `top`, `bottom`        | | placement of the axis |
| orient      | one of `top`, `bottom`        | | orientation of the ticks |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |
