[source](https://github.com/rrag/react-stockcharts/blob/master/docs/lib/charts/CandleStickChartWithCHMousePointer.jsx), [block](http://bl.ocks.org/rrag/261fa4bc7b67536eb789), [plunker](http://plnkr.co/edit/gist:261fa4bc7b67536eb789?p=preview)

```jsx
<ChartCanvas width={width} height={400}
		margin={{left: 70, right: 70, top:10, bottom: 30}} type={type}
		seriesName="MSFT"
		data={data}
		xAccessor={d => d.date} discontinous xScale={financeEODDiscontiniousScale()}
		xExtents={[new Date(2012, 0, 1), new Date(2012, 6, 2)]}>
	<Chart id={1} yExtents={[d => [d.high, d.low]]}
			yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={d3.format(".2f")}>
		<XAxis axisAt="bottom" orient="bottom"/>
		<YAxis axisAt="right" orient="right" ticks={5} />
		<CandlestickSeries />
	</Chart>
	<Chart id={2} origin={(w, h) => [0, h - 150]} height={150} yExtents={d => d.volume}
			yMousePointerDisplayLocation="left" yMousePointerDisplayFormat={d3.format(".4s")}>
		<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
		<HistogramSeries yAccessor={d => d.volume} fill={(d) => d.close > d.open ? "#6BA583" : "#FF0000"} />
	</Chart>
	<MouseCoordinates xDisplayFormat={d3.time.format("%Y-%m-%d")} />
	<EventCapture mouseMove={true} />
	<TooltipContainer>
		<OHLCTooltip forChart={1} origin={[-40, 0]}/>
	</TooltipContainer>
</ChartCanvas>
```

`EventCapture` is used to capture mousemove, scroll/zoom and drag events
```jsx
<EventCapture mouseMove={true} />
```

By default none of the events are captured, and each has to be enabled individually `mouseMove` is enabled above.

```jsx
<MouseCoordinates xDisplayFormat={d3.time.format("%Y-%m-%d")} />
```
Displays the crosshair at the mouse position, the attributes of `MouseCoordinates` are self explanatory.

`Chart` gets a few new props to indicate the y mouse pointer edge location and format
```jsx
yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={d3.format(".2f")}
yMousePointerDisplayLocation="left" yMousePointerDisplayFormat={d3.format(".4s")}
```

And for the tooltip on the top left
```jsx
<TooltipContainer>
	<OHLCTooltip forChart={1} origin={[-40, 0]}/>
</TooltipContainer>
```
use the `origin` and `margin` of `ChartCanvas` to adjust the position of the tooltip. You can also create your custom tooltip, by swapping out `OHLCTooltip` with your own