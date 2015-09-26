This section describes how to create a new `XXXSeries` yourself.

### Prerequisites:

- good understanding of svg and different shapes
- good understanding of HTML5 canvas api
- Knowledge of d3 scales - the [linear scale](https://github.com/mbostock/d3/wiki/Quantitative-Scales#linear) is used heavily


### Some terminology

#### xAccessor / yAccessor
given a datapoint, `xAccessor(dataPoint)` returns the xValue

#### xScale / yScale
given a xValue `xScale(xValue)` converts that value to a pixel location on the x scale. A scale converts a domain of say `1/1/2010` to `1/1/2015` to a range of say 0 - 500 px. So `xScale(new Date(2010, 1, 1))` would return `0` and any date greater that that would return a value above 0 and a date before 1/1/2010 would result in a -ve number on the scale.

#### plotData
This is an array of data points which have to be drawn on the chart.

#### ctx
This is the HTML5 canvas context, you will have to have a decent understanding of how to use it, teaching that is beyond the scope of this section.

#### indicator
For derived Series like say the MACD or RSI, the indicator passed to the `DataSeries` is available from `props`

#### compareSeries
TODO - Write more on how to use `compareSeries`

---
Now before you begin jumping to write a new series yourself, I suggest you look at the [source of a few Series](https://github.com/rrag/react-stockcharts/tree/master/src/lib/series)

- `Area.jsx`
- `Line.jsx`
- `StraightLine.jsx`

are not series themselves but are building blocks which are used in other Series. See [StochasticSeries.jsx](https://github.com/rrag/react-stockcharts/tree/master/src/lib/series/StochasticSeries.jsx), [RSISeries.jsx](https://github.com/rrag/react-stockcharts/tree/master/src/lib/series/RSISeries.jsx) for some examples of how these building blocks are used to create a more complex Series.
