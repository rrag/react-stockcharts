[source](https://github.com/rrag/react-stockcharts/blob/master/docs/lib/charts/CandleStickChartWithEdge.jsx), [block](http://bl.ocks.org/rrag/70ea3fe28ad35bf3ed4c), [plunker](http://plnkr.co/edit/gist:70ea3fe28ad35bf3ed4c?p=preview)

`EdgeIndicator`s are inside each `Chart`, can be of type `first` or `last`, can be located `left` or `right` and orient `left` or `right`. Below you see edges `first` and `last` for all the overlays and also for the `volume` histogram.

The edge values are updated on zoom and pan also

```jsx
<Chart id={1} ...>
	...
	<EdgeIndicator itemType="last" orient="right" edgeAt="right"
		yAccessor={ema20.accessor()} fill={ema20.fill()}/>
	<EdgeIndicator itemType="last" orient="right" edgeAt="right"
		yAccessor={ema50.accessor()} fill={ema50.fill()}/>
	<EdgeIndicator itemType="last" orient="right" edgeAt="right"
		yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>
	<EdgeIndicator itemType="first" orient="left" edgeAt="left"
		yAccessor={ema20.accessor()} fill={ema20.fill()}/>
	<EdgeIndicator itemType="first" orient="left" edgeAt="left"
		yAccessor={ema50.accessor()} fill={ema50.fill()}/>
	<EdgeIndicator itemType="first" orient="left" edgeAt="left"
		yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>
</Chart>
<Chart id={2} ...>
	...
	<EdgeIndicator itemType="first" orient="left" edgeAt="left"
		yAccessor={d => d.volume} displayFormat={d3.format(".4s")} fill="#0F0F0F"/>
	<EdgeIndicator itemType="last" orient="right" edgeAt="right"
		yAccessor={d => d.volume} displayFormat={d3.format(".4s")} fill="#0F0F0F"/>
	<EdgeIndicator itemType="first" orient="left" edgeAt="left"
		yAccessor={smaVolume50.accessor()} displayFormat={d3.format(".4s")} fill={smaVolume50.fill()}/>
	<EdgeIndicator itemType="last" orient="right" edgeAt="right"
		yAccessor={smaVolume50.accessor()} displayFormat={d3.format(".4s")} fill={smaVolume50.fill()}/>
</Chart>
```