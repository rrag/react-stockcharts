[source](https://github.com/rrag/react-stockcharts/blob/master/docs/lib/charts/CandleStickStockScaleChart.jsx), [block](http://bl.ocks.org/rrag/1eac0cb78f27b31415ac), [plunker](http://plnkr.co/edit/gist:1eac0cb78f27b31415ac?p=preview)

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
<ChartCanvas width={width} height={400}
		margin={{left: 50, right: 50, top:10, bottom: 30}} type={type}
		seriesName="MSFT"
		data={data}
		xAccessor={d => d.date} discontinous xScale={financeEODDiscontiniousScale()}
		xExtents={[new Date(2012, 0, 1), new Date(2012, 6, 2)]}>

	<Chart id={1} yExtents={d => [d.high, d.low]}>
		<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
		<YAxis axisAt="left" orient="left" ticks={5} />
		<CandlestickSeries />
	</Chart>
</ChartCanvas>
```

Compare this with the simpler `AreaChart` example from before

```js
discontinous xScale={financeEODDiscontiniousScale()}
```
is the only difference in `<ChartCanvas>`

- `discontinous` is to indicate that the data provided is to be displayed is discontinious -- in this case has gaps for weekend
- `financeEODDiscontiniousScale()` - `financeEODDiscontiniousScale` is a discontinious scale provided by `react-stockcharts`

```jsx
<Chart id={1} yExtents={d => [d.high, d.low]}>
```

- `yExtents` can accept
	- a function which returns a number / an object / an array of numbers. The min and max value of these are used to calculate the y domain
	- an array of functions - same as above
	- min and max values as number. Say you always want to show the y domain between 0 and 100, you may say `yExtents={[0, 100]}`

```jsx
<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
<YAxis axisAt="left" orient="left" ticks={5} />
<CandlestickSeries />
```

Same as for `AreaChart` example.
