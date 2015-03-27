
```html
<ChartCanvas width={this.state.width} height={400} margin={{left: 40, right: 70, top:10, bottom: 30}} data={data}>
	<DataTransform transformType="stockscale">
		<Chart id={1} >
			<XAxis axisAt="bottom" orient="bottom"/>
			<YAxis axisAt="right" orient="right" ticks={5} />
			<DataSeries yAccessor={CandlestickSeries.yAccessor} >
				<CandlestickSeries />
			</DataSeries>
		</Chart>
		<Chart id={2} height={150} origin={(w, h) => [0, h - 150]}>
			<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
			<DataSeries yAccessor={(d) => d.volume} >
				<HistogramSeries className={(d) => d.close > d.open ? 'up' : 'down'} />
			</DataSeries>
		</Chart>
		<MouseCoordinates forChart={1} xDisplayFormat={d3.time.format("%Y-%m-%d")} yDisplayFormat={(y) => y.toFixed(2)}>
			<CrossHair />
		</MouseCoordinates>
		<EventCapture mouseMove={true} mainChart={1}/>
		<TooltipContainer>
			<OHLCTooltip forChart={1} origin={[-40, 0]}/>
		</TooltipContainer>
	</DataTransform>
</ChartCanvas>
```
