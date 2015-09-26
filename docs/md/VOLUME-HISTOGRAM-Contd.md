checkout the [source](https://gist.github.com/rrag/0a54ca33b05001f17f8f), [block](http://bl.ocks.org/rrag/0a54ca33b05001f17f8f), [plunker](http://plnkr.co/edit/gist:0a54ca33b05001f17f8f?p=preview) of this example

```jsx
<ChartCanvas width={this.state.width} height={400} margin={{left: 50, right: 50, top:10, bottom: 30}} initialDisplay={100}
	dataTransform={[ { transform: StockscaleTransformer } ]} data={data} type="svg" >
	<Chart id={1} >
		<XAxis axisAt="bottom" orient="bottom"/>
		<YAxis axisAt="right" orient="right" ticks={5} />
		<DataSeries id={0} yAccessor={CandlestickSeries.yAccessor} >
			<CandlestickSeries />
		</DataSeries>
	</Chart>
	<Chart id={2} height={150} origin={(w, h) => [0, h - 150]}>
		<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
		<DataSeries id={0} yAccessor={(d) => d.volume} >
			<HistogramSeries fill={(d) => d.close > d.open ? "#6BA583" : "red"} />
		</DataSeries>
	</Chart>
</ChartCanvas>
```

The portion of interest here is

```jsx
<Chart id={2} height={150} origin={(w, h) => [0, h - 150]}>
```

the chart has a defined `height` of 150.

`origin` can be either a coordinate [x, y] or a function which returns a `[x, y]` 

`(w, h) => [0, h - 150]` is the same as `function (w, h) { return [0, h - 150]; }`

given the `width` and `height` available inside the `ChartCanvas` as input, this function returns an origin of `[0, height - 150]` to draw the volume histogram

Similarly the `fill` of `HistogramSeries` accepts either
- a function which returns a string representing the color
- or a string representing the color

```jsx
<HistogramSeries fill={(d) => d.close > d.open ? "#6BA583" : "red"} />
```

#### Another Version
In this you can see how the volume histogram and the candlestick chart do not overlap.