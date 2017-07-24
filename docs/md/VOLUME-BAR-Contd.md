[source](https://github.com/rrag/react-stockcharts/blob/master/docs/lib/charts/CandleStickStockScaleChartWithVolumeBarV2.js), [codesandbox](https://codesandbox.io/s/github/rrag/react-stockcharts-examples2/tree/master/examples/CandleStickStockScaleChartWithVolumeBarV2)


```js
import { format } from "d3-format";
```

```jsx
<ChartCanvas width={width} height={400}
		margin={{left: 50, right: 50, top:10, bottom: 30}} type={type}
		seriesName="MSFT"
		data={data}
		xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider}
		xExtents={[new Date(2012, 0, 1), new Date(2012, 6, 2)]}>
	<Chart id={1} yExtents={d => [d.high, d.low]}>
		<XAxis axisAt="bottom" orient="bottom"/>
		<YAxis axisAt="right" orient="right" ticks={5} />
		<CandlestickSeries />
	</Chart>
	<Chart id={2} origin={(w, h) => [0, h - 150]} height={150} yExtents={d => d.volume}>
		<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".0s")}/>
		<BarSeries yAccessor={d => d.volume} fill={(d) => d.close > d.open ? "#6BA583" : "red"} />
	</Chart>
</ChartCanvas>
```

The portion of interest here is

```jsx
<Chart id={2} origin={(w, h) => [0, h - 150]} height={150} yExtents={d => d.volume}>
```

the chart has a defined `height` of 150.

`origin` can be either a coordinate [x, y] or a function which returns a `[x, y]`, the default value is `[0, 0]`

`(w, h) => [0, h - 150]` is the same as `function (w, h) { return [0, h - 150]; }`

given the `width` and `height` available inside the `ChartCanvas` as input, this function returns an origin of `[0, height - 150]` to draw the volume bar

Similarly the `fill` of `BarSeries` accepts either
- a function which returns a string representing the color
- or a string representing the color

```jsx
<BarSeries yAccessor={d => d.volume} fill={(d) => d.close > d.open ? "#6BA583" : "red"} />
```

#### Another Version
In this you can see how the volume bar and the candlestick chart do not overlap.