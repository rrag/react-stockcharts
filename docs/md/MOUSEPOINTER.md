[source](https://github.com/rrag/react-stockcharts/blob/master/docs/lib/charts/CandleStickChartWithCHMousePointer.js), [codesandbox](https://codesandbox.io/s/github/rrag/react-stockcharts-examples2/tree/master/examples/CandleStickChartWithCHMousePointer)


```js
import { timeFormat } from "d3-time-format";
import { format } from "d3-format";
```

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
		<MouseCoordinateY
			at="right"
			orient="right"
			displayFormat={format(".2f")} />
		<CandlestickSeries />
		<OHLCTooltip origin={[-40, 0]}/>
	</Chart>
	<Chart id={2} height={150}
			yExtents={d => d.volume}
			origin={(w, h) => [0, h - 150]}>
		<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".0s")}/>

		<MouseCoordinateX
			at="bottom"
			orient="bottom"
			displayFormat={timeFormat("%Y-%m-%d")} />
		<MouseCoordinateY
			at="left"
			orient="left"
			displayFormat={format(".4s")} />

		<BarSeries yAccessor={d => d.volume} fill={(d) => d.close > d.open ? "#6BA583" : "#FF0000"} />
	</Chart>
	<CrossHairCursor />
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