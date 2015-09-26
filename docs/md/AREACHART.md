
checkout the [source](https://gist.github.com/rrag/b9658ffa431f1ffb8d6b), [block](http://bl.ocks.org/rrag/b9658ffa431f1ffb8d6b), [plunker](http://plnkr.co/edit/gist:b9658ffa431f1ffb8d6b?p=preview) of this example

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


```jsx
<ChartCanvas width={this.state.width} height={400} margin={{left: 50, right: 50, top:10, bottom: 30}}
	data={data} type="svg" >
	<Chart id={0} xAccessor={(d) => d.date}>
		<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
		<YAxis axisAt="left" orient="left" />
		<DataSeries id={0} yAccessor={(d) => d.close} >
			<AreaSeries />
		</DataSeries>
	</Chart>
</ChartCanvas>
```

Let us review each line

```jsx
<ChartCanvas width={...} height={...} margin={{left: 50, right: 50, top:10, bottom: 30}} data={data} type="svg" >
```

Creates an `svg` element with the provided `height` and `width` and creates a `svg:g` element with the provided `margin`. and `data` is used to plot.

the `type` can take 2 values `svg` or `hybrid`.

Choosing `svg` will create the entire chart using `svg` elements
Choosing `hybrid` will create the contents of the `DataSeries` using `canvas` but the axis and other elements are `svg`

So irrespective of what type you choose, you will have a `svg` element

```jsx
<Chart id={0} xAccessor={(d) => d.date}>
```

There can be one or more `Chart`s in each `ChartCanvas` and hence the need for an `id` attribute.

The `xAccessor` is to be used for *all* the `DataSeries` inside this `Chart`. This simple example shows one `DataSeries` you will learn more complex examples soon.

If you are not familiar with [scales](https://github.com/mbostock/d3/wiki/Scales) in d3 I recommend doing so. Each `Chart` defines an `xScale` and `yScale`. For starters, it is easier to understand scale as a function which converts a `domain` say 2009-01-05 to 2015-06-08 to a `range` say 0 to 500 pixels. This scale can now interpolate an input date to a value in pixels.

With SVG & Canvas it is important to understand the coordinate system and where the origin `(0, 0)` is located. for a SVG of size 300x100, the 

![alt text](http://www.w3.org/TR/SVG/images/coords/InitialCoords.png "SVG/Canvas coordinate system")

For more details about the coordinate system see [here](http://www.w3.org/TR/SVG/coords.jsx)

Back to scales,

X Axis uses a time scale
A time scale converts a date/time domain to a range, this is used as the xScale, the xDomain is calculated from the input data, and the range is calculated as `width - margin.left - margin.right`.

Y Axis uses a linear scale
A Linear scale converts a `domain` say 10 - 45 to a `range` say 0 to 300 pixels. Like the name represents the data in between is interpolated linear.

```jsx
<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
```
The `ticks` attribute simple passes on the value to the [d3.axis](https://github.com/mbostock/d3/wiki/SVG-Axes#ticks), the `XAxis` also has the following optional attributes `innerTickSize, outerTickSize, tickFormat, tickPadding, tickSize, ticks, tickValues` all of which correspond to a function with the same name in d3.axis.

`axisAt` takes on possible values as `top, middle, bottom` for advanced cases, you can also pass in a number indicating the pixel position where the axis has to be drawn.

`orient` takes on possible values as `top, bottom`, this orients the axis ticks on the top/bottom


```jsx
<YAxis axisAt="left" orient="left" />
```
Similar to `XAxis` except left/right instead of top/bottom


```jsx
<DataSeries id={0} yAccessor={(d) => d.close} >
	<AreaSeries />
</DataSeries>
```

`id` is a required attribute, there can be multiple `DataSeries` per `Chart`, use unique numbers for `id`.

`DataSeries` houses the y Accessor. You will find in other examples later how `DataSeries` helps create a yAccessor with more than one y value to plot for a given x, like in candlestick.

If you are not clear what the arrow functions mean, read more about them [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions). In short

`(d) => d.close` means `function (d) { return d.close; }`

`(d) => d.date` means `function (d) { return d.date; }`

### Highly customizable you say, how?

So you dont want to display the `YAxis` at all, go ahead and just remove that.

Want to display `YAxis` on both left and right? add 

```jsx
<YAxis axisAt="right" orient="right" />
```
next to the existing `YAxis`

Create custom components and use them, it is explained [here](http://add.link.here)

Want to add a `YAxis` with a percent scale on the right? add
```jsx
<YAxis axisAt="right" orient="right" percentScale={true} tickFormat={d3.format(".0%")}/>
```
and you get.