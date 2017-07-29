[source](https://github.com/rrag/react-stockcharts/blob/master/docs/lib/charts/CandleStickStockScaleChart.js), [codesandbox](https://codesandbox.io/s/github/rrag/react-stockcharts-examples2/tree/master/examples/CandleStickStockScaleChart)

That is better. let us see how to create it

`data.tsv`

date       | open     | high | low | close
-----------|----------| -----|-----|------
2013-08-16 | 5705.45 | 5716.6 | 5496.05 | 5507.85
2013-08-19 | 5497.55 | 5499.65 | 5360.65 | 5414.75
2013-08-20 | 5353.45 | 5417.8 | 5306.35 | 5401.45
... | ... | ... | ... | ...


```js
import { timeParse } from "d3-time-format";
import { tsv } from "d3-request";

var parseDate = timeParse("%Y-%m-%d");

tsv("path/to/data.tsv", function(err, data) {
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
		xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider}
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
xScaleProvider={discontinuousTimeScaleProvider}
```

is the only difference in `<ChartCanvas>`

`xScale` is replaced with `xScaleProvider`, `discontinuousTimeScaleProvider` is a function which takes some pre calculated values and the data array to return a scale that removes the discontinuity, to and show a linear scale

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

## Customizing Candles

You can change the looks of the candles by adding this to the top of your file:

```
const candlesAppearance = {
  wickStroke: "#000000",
  fill: function fill(d) {
    return d.close > d.open ? "rgba(196, 205, 211, 0.8)" : "rgba(22, 22, 22, 0.8)";
  },
  stroke: "#000000",
  candleStrokeWidth: 1,
  widthRatio: 0.8,
  opacity: 1,
}
``

Then, make sure to rendre the CandlestickSeries component as such:

```
<CandlestickSeries
   {...candlesAppearance} />
```
