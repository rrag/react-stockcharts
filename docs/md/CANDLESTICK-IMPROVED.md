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

```html
<ChartCanvas width={...} height={...} margin={{left: 50, right: 50, top:10, bottom: 30}} data={data}>
	<DataTransform transformType="stockscale">
		<Chart id={1} >
			<XAxis axisAt="bottom" orient="bottom" ticks={5}/>
			<YAxis axisAt="right" orient="right" ticks={5} />
			<DataSeries yAccessor={CandlestickSeries.yAccessor} >
				<CandlestickSeries />
			</DataSeries>
		</Chart>
	</DataTransform>
</ChartCanvas>
```

Compare this with the simpler `AreaChart` example from before

```html
<ChartCanvas width={...} height={...} margin={{left: 50, right: 50, top:10, bottom: 30}} data={data}>
```

It is the same as for `AreaChart`


```html
<DataTransform transformType="stockscale">
```

Converting the data provided as input which when taken as a linear scale includes weekend time breaks, into a linear scale over the input domain. More usecases of `DataTransform` are listed below.

**Coming Soon** Create your own transforms and register them for use

```html
<Chart id={1} >
	<XAxis axisAt="bottom" orient="bottom" ticks={5}/>
	<YAxis axisAt="right" orient="right" ticks={5} />
```

Same as for `AreaChart` example above

```html
<DataSeries yAccessor={CandlestickSeries.yAccessor} >
	<CandlestickSeries />
</DataSeries>
```
You will notice that the `DataSeries` component does not include the `xAccessor`, that is because it is defined inside the stockscale `DataTransform` which provides the `xAccessor` behind the scenes

`yAccessor={CandlestickSeries.yAccessor}` is just a convenience `yAccessor` available, it can also be represented as

```js
yAccessor={(d) => ({open: d.open, high: d.high, low: d.low, close: d.close})}
```
or if arrow functions is not your thing, use
```js
yAccessor={function (d) { return {open: d.open, high: d.high, low: d.low, close: d.close}; }}
```