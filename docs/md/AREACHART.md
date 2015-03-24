
`data.tsv`

date       | close
---------- | -------
2011-01-24 | 5743.25
2011-01-25 | 5687.4
2011-01-27 | 5604.3
2011-01-28 | 5512.15
... | ...


```js
var d3 = require('d3');
var parseDate = d3.time.format("%Y-%m-%d").parse

d3.tsv("path/to/data.tsv", function(err, data) {
	data.forEach((d, i) => {
		d.date = new Date(parseDate(d.date).getTime());
		d.close = +d.close;
	});
...
```


```html
<ChartCanvas width={...} height={...} margin={{left: 50, right: 50, top:10, bottom: 30}} data={data}>
	<Chart id={0}>
		<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
		<YAxis axisAt="left" orient="left" />
		<DataSeries yAccessor={(d) => d.close} xAccessor={(d) => d.date}>
			<AreaSeries />
		</DataSeries>
	</Chart>
</ChartCanvas>
```

Let us review each line

```html
<ChartCanvas width={...} height={...} margin={{left: 50, right: 50, top:10, bottom: 30}} data={data}>
```

Creates an `svg` element with the provided `height` and `width` and creates a `svg:g` element with the provided `margin`. `data` is well the data used to plot.

```html
<Chart id={0}>
```

There can be one or more `Chart`s in each `ChartCanvas` and hence the need for an `id` attribute.

If you are not familiar with [scales](https://github.com/mbostock/d3/wiki/Scales) in d3 I recommend doing so. Each `Chart` defines an `xScale` and `yScale`. For starters, it is easier to understand scale as a function which converts a `domain` say 2011-01-01 to 2014-12-31 to a `range` say 0 to 500 pixels. This scale can now interpolate an input date to a value in pixels which can be drawn.

With SVG it is important to understand the coordinate system and where the origin `(0, 0)` is located. for a SVG of size 300x100, the 

![alt text](http://www.w3.org/TR/SVG/images/coords/InitialCoords.png "Logo Title Text 1")

For more details about the SVG coordinate system see [here](http://www.w3.org/TR/SVG/coords.html)

Back to scales,

A time scale converts a date/time domain to a range, this is used as the xScale, the xDomain is calculated from the input data, and the range is calculated as `height - margin.left - margin.right`.

A Linear scale converts a `domain` say 4600 - 6200 to a `range` say 0 to 300 pixels. Like the name represents the data in between is interpolated linear, similarly there is log scale which creates a logrithmic scale, which is not linear.

```html
<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
```
The `ticks` attribute simple passes on the value to the [d3.axis](https://github.com/mbostock/d3/wiki/SVG-Axes#ticks), the `XAxis` also has the following optional attributes `innerTickSize, outerTickSize, tickFormat, tickPadding, tickSize, ticks, tickValues` all of which correspond to a function with the same name in d3.axis.

`axisAt` takes on possible values as `top, middle, bottom` for advanced cases, you can also pass in a number indicating the pixel position where the axis has to be drawn.

`orient` takes on possible values as `top, bottom`, this orients the axis ticks on the top/bottom


```html
<YAxis axisAt="left" orient="left" />
```
Similar to `XAxis` except left/right instead of top/bottom


```html
<DataSeries yAccessor={(d) => d.close} xAccessor={(d) => d.date}>
    <AreaSeries />
</DataSeries>
```

A `DataSeries` is a shell component intended to house the x and y Accessor. You will find in other examples below how `DataSeries` helps create a yAccessor with more than one y  value to plot for a given x, like in candlestick.

If you are not clear what the arrow functions mean, read more about them [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions). In short

`(d) => d.close` means `function (d) { return d.close; }`

`(d) => d.date` means `function (d) { return d.date; }`

### Highly customizable you say, how?

So you dont want to display the `YAxis` at all, go ahead and just remove that.

Want to display `YAxis` on both left and right? add 
```html
<YAxis axisAt="right" orient="right" />
```
next to the existing `YAxis`

Want to add a `YAxis` with a percent scale on the right? add
```html
<YAxis axisAt="right" orient="right" percentScale={true} tickFormat={d3.format(".0%")}/>
```
and you will get.