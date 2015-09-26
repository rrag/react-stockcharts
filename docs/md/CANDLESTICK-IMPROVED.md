checkout the [source](https://gist.github.com/rrag/1eac0cb78f27b31415ac), [block](http://bl.ocks.org/rrag/1eac0cb78f27b31415ac), [plunker](http://plnkr.co/edit/gist:1eac0cb78f27b31415ac?p=preview) of this example

That is better. let us see how to create it

`data.tsv`

date       | open     | high | low | close
-----------|----------| -----|-----|------
2013-08-16 | 5705.45 | 5716.6 | 5496.05 | 5507.85
2013-08-19 | 5497.55 | 5499.65 | 5360.65 | 5414.75
2013-08-20 | 5353.45 | 5417.8 | 5306.35 | 5401.45
... | ... | ... | ... | ...


```js
var d3 = require('d3');
var parseDate = d3.time.format("%Y-%m-%d").parse;

d3.tsv("path/to/data.tsv", function(err, data) {
	data.forEach((d, i) => {
		d.date = new Date(parseDate(d.date).getTime());
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
	});
...
```

```jsx
<ChartCanvas width={this.state.width} height={400} margin={{left: 50, right: 50, top:10, bottom: 30}}
	dataTransform={[ { transform: StockscaleTransformer } ]} data={data} type="svg">
	<Chart id={1} >
		<XAxis axisAt="bottom" orient="bottom" />
		<YAxis axisAt="right" orient="right" ticks={5} />
		<DataSeries id={0} yAccessor={CandlestickSeries.yAccessor} >
			<CandlestickSeries />
		</DataSeries>
	</Chart>
</ChartCanvas>
```

Compare this with the simpler `AreaChart` example from before

```js
dataTransform={[ { transform: StockscaleTransformer } ]} 
```
is the only difference in `<ChartCanvas>`

`dataTransform` transforms the `data` provided as input which when taken as a linear scale includes weekend time breaks, into a linear scale over the input domain.

Notice that it accepts an array. You can chain multiple transfoms together by adding them to the array. Some examples of that can be seen in the advanced chart types later on. Using this technique user can create custom transforms, and create their own components which uses the modified data.

```jsx
<Chart id={1} >
```
You will notice that the `Chart` component does not include the `xAccessor`, that is because it is defined inside the stockscale which provides the `xAccessor` behind the scenes

```jsx
<XAxis axisAt="bottom" orient="bottom" ticks={5}/>
<YAxis axisAt="right" orient="right" ticks={5} />
<DataSeries yAccessor={CandlestickSeries.yAccessor} >
	<CandlestickSeries />
</DataSeries>
```

Same as for `AreaChart` example above


`yAccessor={CandlestickSeries.yAccessor}` is just a convenience `yAccessor` available, it can also be represented as

```js
yAccessor={(d) => ({open: d.open, high: d.high, low: d.low, close: d.close})}
```
