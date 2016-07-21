[source](https://github.com/rrag/react-stockcharts/blob/master/docs/lib/charts/CandleStickChartWithCHMousePointer.jsx), [block](http://bl.ocks.org/rrag/261fa4bc7b67536eb789), [plunker](http://plnkr.co/edit/gist:261fa4bc7b67536eb789?p=preview)

```jsx
<ChartCanvas width={width} height={400}
		margin={{left: 70, right: 70, top:10, bottom: 30}} type={type}
		seriesName="MSFT"
		data={data}
		xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider}
		xExtents={[new Date(2012, 0, 1), new Date(2012, 6, 2)]}>
	<Chart id={1}
			yExtents={[d => [d.high, d.low]]}>
		<XAxis axisAt="bottom" orient="bottom"/>
		<YAxis axisAt="right" orient="right" ticks={5} />
		<MouseCoordinateY id={0}
			at="right"
			orient="right"
			displayFormat={d3.format(".2f")} />
		<CandlestickSeries />
	</Chart>
	<Chart id={2} height={150}
			yExtents={d => d.volume}
			origin={(w, h) => [0, h - 150]}>
		<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>

		<MouseCoordinateX id={0}
			at="bottom"
			orient="bottom"
			displayFormat={d3.time.format("%Y-%m-%d")} />
		<MouseCoordinateY id={0}
			at="left"
			orient="left"
			displayFormat={d3.format(".4s")} />

		<BarSeries yAccessor={d => d.volume} fill={(d) => d.close > d.open ? "#6BA583" : "#FF0000"} />
	</Chart>
	<CrossHairCursor />
	<EventCapture mouseMove />
	<TooltipContainer>
		<OHLCTooltip forChart={1} origin={[-40, 0]}/>
	</TooltipContainer>
</ChartCanvas>
```

`EventCapture` is used to capture mousemove, scroll/zoom and drag events

```jsx
<EventCapture mouseMove />
```

By default none of the events are captured, and each has to be enabled individually `mouseMove` is enabled above.

```jsx
<CrossHairCursor />
```
Displays the crosshair at the mouse position. If you prefer a different type of cursor, just swap this out with a custom one

Notice there is a `MouseCoordinateY` for each `Chart`, this shows the value of y mouse pointer for each chart. The different props are self explanatory

`MouseCoordinateX` is also self explanatory, you could have multiple of these with different `at` and `orient` values to show the x coordinate multiple times at different places

And for the tooltip on the top left
```jsx
<TooltipContainer>
	<OHLCTooltip forChart={1} origin={[-40, 0]}/>
</TooltipContainer>
```
use the `origin` and `margin` of `ChartCanvas` to adjust the position of the tooltip. You can also create your custom tooltip, by swapping out `OHLCTooltip` with your own