[source](https://github.com/rrag/react-stockcharts/blob/master/docs/lib/charts/CandleStickStockScaleChartWithVolumeBarV1.jsx), [block](http://bl.ocks.org/rrag/88cd65baa331d57caa83), [plunker](http://plnkr.co/edit/gist:88cd65baa331d57caa83?p=preview)

```jsx
<ChartCanvas width={width} height={400}
		margin={{left: 50, right: 50, top:10, bottom: 30}} type={type}
		seriesName="MSFT"
		data={data}
		xAccessor={d => d.date} discontinous xScale={financeEODDiscontiniousScale()}
		xExtents={[new Date(2012, 0, 1), new Date(2012, 6, 2)]}>

	<Chart id={1} yExtents={d => [d.high, d.low]}>
		<XAxis axisAt="bottom" orient="bottom"/>
		<YAxis axisAt="right" orient="right" ticks={5} />
		<CandlestickSeries />
	</Chart>
	<Chart id={2} yExtents={d => d.volume}>
		<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
		<HistogramSeries yAccessor={d => d.volume} />
	</Chart>
</ChartCanvas>
```

Look!!! there is more than one `Chart` there. Each `Chart` has different `yExtents` to indicate its domain. 

Remember all `Chart`s use the same `data` and `xScale` but each `Chart` has `yScale`.

But... I dont want the Volume chart to span the whole chart height. I got you covered.