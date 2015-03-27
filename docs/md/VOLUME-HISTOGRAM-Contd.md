
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
		<Chart id={2} height={150} origin={(w, h) => [0, h - 150]}>
			<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
			<DataSeries yAccessor={(d) => d.volume} >
				<HistogramSeries className={(d) => d.close > d.open ? 'up' : 'down'} />
			</DataSeries>
		</Chart>
	</DataTransform>
</ChartCanvas>
```

The portion of interest here is

```html
<Chart id={2} height={150} origin={(w, h) => [0, h - 150]}>
```

the chart has a defined `height` of 150, which is good.

`origin` can be either a function which returns a `[x, y]` to be used as origin or it can be an array with 2 elements representing `[x, y]`. The default value for `origin` is `[0, 0]`

`(w, h) => [0, h - 150]` is the same as `function (w, h) { return [0, h - 150]; }`

given the `width` and `height` available inside the `ChartCanvas` as input, this function returns an origin of `[0, height - 150]` to draw the volume histogram

Similarly the `className` of `HistogramSeries` accepts either
- a function which returns a string 
- or a string

which is used as the css class

```html
<HistogramSeries className={(d) => d.close > d.open ? 'up' : 'down'} />
```

a class of 'up' is applied if `close > open` for that day and 'down' otherwise