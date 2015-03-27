
```html
<ChartCanvas width={this.state.width} height={400} margin={{left: 50, right: 50, top:10, bottom: 30}} data={data}>
	<DataTransform transformType="stockscale">
		<Chart id={1} >
			<XAxis axisAt="bottom" orient="bottom"/>
			<YAxis axisAt="right" orient="right" ticks={5} />
			<DataSeries yAccessor={CandlestickSeries.yAccessor} >
				<CandlestickSeries />
			</DataSeries>
		</Chart>
		<Chart id={2}>
			<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
			<DataSeries yAccessor={(d) => d.volume} >
				<HistogramSeries />
			</DataSeries>
		</Chart>
	</DataTransform>
</ChartCanvas>
```

Look!!! there is more than one `Chart` there.

Each `Chart` has a pair of `xScale` and `yScale` since `volume` is on a different domain from `open`/`high`/`low`/`close`, It has to be created as a different `Chart`.

To summarize, All `Chart`s use the same `data` but each `Chart` has different `xScale` and `yScale`. In this example above the `xScale` of chart 2 has the same `domain` and `range` as the `xScale` of `Chart` 1, so we did not draw the `XAxis` again for the Volume.

##### But... I dont want the Volume chart to span the whole chart height.

I got you covered.