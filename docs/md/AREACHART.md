
`data.tsv`

date       | open   | high    | low     | close
---------- | ------ | ------- | ------- | -------
2011-01-24 | 5717.1 | 5756.0  | 5697.75 | 5743.25
2011-01-25 | 5763.3 | 5801.55 | 5680.65 | 5687.4
2011-01-27 | 5725.3 | 5726.1  | 5594.95 | 5604.3
2011-01-28 | 5614.0 | 5614.4  | 5459.55 | 5512.15
... | ... | ...  | ... | ...


```js
var d3 = require('d3');
var parseDate = d3.time.format("%Y-%m-%d").parse

d3.tsv("path/to/data.tsv", function(err, data) {
	data.forEach((d, i) => {
		d.date = new Date(parseDate(d.date).getTime());
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
	});
...
...

```


```html
<ChartCanvas width={...} height={...} margin={{left: 50, right: 50, top:10, bottom: 30}} data={data}>
	<Chart id={0} >
		<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
		<YAxis axisAt="left" orient="left" />
		<DataSeries yAccessor={(d) => d.close} xAccessor={(d) => d.date}>
			<AreaSeries />
		</DataSeries>
	</Chart>
</ChartCanvas>
```