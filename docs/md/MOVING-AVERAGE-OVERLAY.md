`Overlay`s share the scales of a `Chart` and contribute to the `domain` of the `Chart` they belong to.

In this chart we are introducing 

- Moving average on daily `close` as a `LineSeries`
- Moving average on daily `volume` as an `AreaSeries`
- Current item indicator as a circle over the different moving averages
- Moving average tooltip

Let us review each of these in a little more detail

#### Moving average on daily `close` as a `LineSeries`

```html
<DataSeries yAccessor={CandlestickSeries.yAccessor} >
	<CandlestickSeries />
	<OverlaySeries id={0} type="sma" options={{ period: 20, pluck: 'close' }}>
		<LineSeries/>
	</OverlaySeries>
	<OverlaySeries id={1} type="sma" options={{ period: 30 }} >
		<LineSeries/>
	</OverlaySeries>
	<OverlaySeries id={2} type="sma" options={{ period: 50 }} >
		<LineSeries/>
	</OverlaySeries>
</DataSeries>
```

`type` indicates it is a simple moving average, `options` used to specify the moving average `period`, and `pluck` to specify attribute against which moving average is to be calculated. If not specified, `pluck` defaults to `close`

#### Moving average on daily `volume` as an `AreaSeries`

```html
<DataSeries yAccessor={(d) => d.volume} >
	<HistogramSeries className={(d) => d.close > d.open ? 'up' : 'down'} />
	<OverlaySeries id={3} type="sma" options={{ period: 10, pluck:'volume' }} >
		<AreaSeries/>
	</OverlaySeries>
</DataSeries>
```

Similar to above

#### Current item indicator as a circle over the different moving averages

```html
<CurrentCoordinate forChart={1} forOverlay={0} />
<CurrentCoordinate forChart={1} forOverlay={1} />
<CurrentCoordinate forChart={1} forOverlay={2} />
<CurrentCoordinate forChart={2} forOverlay={3} />
<CurrentCoordinate forChart={2}/>
```

That was easy, right?

`forOverlay` is an optional attribute, and absense of that will default the `CurrentCoordinate` to display a circle on the main series. This only makes sense if the main series plots a single value on y. For `CandlestickSeries` as it plots 4 attributes, `CurrentCoordinate` is not valid for `CandlestickSeries`

#### Moving average tooltip

```html
<TooltipContainer>
	<OHLCTooltip forChart={1} origin={[-40, 0]}/>
	<MovingAverageTooltip forChart={1} onClick={(e) => console.log(e)} origin={[-38, 15]}/>
</TooltipContainer>
```

Open the dev console and see what is logged on click of the moving average tooltip

adding it all together

```jsx
<ChartCanvas width={this.state.width} height={400} margin={{left: 40, right: 70, top:10, bottom: 30}} data={data}>
	<DataTransform transformType="stockscale">
		<Chart id={1} >
			<XAxis axisAt="bottom" orient="bottom"/>
			<YAxis axisAt="right" orient="right" ticks={5} />
			<DataSeries yAccessor={CandlestickSeries.yAccessor} >
				<CandlestickSeries />
				<OverlaySeries id={0} type="sma" options={{ period: 20, pluck: 'close' }}>
					<LineSeries/>
				</OverlaySeries>
				<OverlaySeries id={1} type="sma" options={{ period: 30 }} >
					<LineSeries/>
				</OverlaySeries>
				<OverlaySeries id={2} type="sma" options={{ period: 50 }} >
					<LineSeries/>
				</OverlaySeries>
			</DataSeries>
		</Chart>
		<CurrentCoordinate forChart={1} forOverlay={0} />
		<CurrentCoordinate forChart={1} forOverlay={1} />
		<CurrentCoordinate forChart={1} forOverlay={2} />
		<Chart id={2} height={150} origin={(w, h) => [0, h - 150]}>
			<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
			<DataSeries yAccessor={(d) => d.volume} >
				<HistogramSeries className={(d) => d.close > d.open ? 'up' : 'down'} />
				<OverlaySeries id={3} type="sma" options={{ period: 10, pluck:'volume' }} >
					<AreaSeries/>
				</OverlaySeries>
			</DataSeries>
		</Chart>
		<CurrentCoordinate forChart={2} forOverlay={3} />
		<CurrentCoordinate forChart={2}/>
		<MouseCoordinates forChart={1} xDisplayFormat={dateFormat} yDisplayFormat={(y) => y.toFixed(2)}>
			<CrossHair />
		</MouseCoordinates>
		<EventCapture mouseMove={true} zoom={true} pan={true} mainChart={1} defaultFocus={false} />
		<TooltipContainer>
			<OHLCTooltip forChart={1} origin={[-40, 0]}/>
			<MovingAverageTooltip forChart={1} onClick={(e) => console.log(e)} origin={[-38, 15]}/>
		</TooltipContainer>
	</DataTransform>
</ChartCanvas>
```