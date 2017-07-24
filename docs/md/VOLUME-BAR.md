[source](https://github.com/rrag/react-stockcharts/blob/master/docs/lib/charts/CandleStickStockScaleChartWithVolumeBarV1.js), [codesandbox](https://codesandbox.io/s/github/rrag/react-stockcharts-examples2/tree/master/examples/CandleStickStockScaleChartWithVolumeBarV1)


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
	<Chart id={2} yExtents={d => d.volume}>
		<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".0s")}/>
		<BarSeries yAccessor={d => d.volume} />
	</Chart>
</ChartCanvas>

```

Look!!! there is more than one `Chart` there. Each `Chart` has different `yExtents` to indicate its domain. 

Remember all `Chart`s use the same `data` and `xScale` but each `Chart` has `yScale`.

But... I don't want the Volume chart to span the whole chart height. I got you covered.
