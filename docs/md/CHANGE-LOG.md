### v0.2

1. Create Pure React based `svg` axes. Now both `XAxis` and `YAxis` do not use the `d3` to render inside `componentDidMount` / `componentDidUpdate`
1. A new property `type` is added to `ChartCanvas` and it takes one of 2 values
	- `svg` which creates the chart using pure svg
	- `hybrid` which creates the chart using a combination of `svg` and `canvas`. `canvas` is used to draw the different series, like Line, Area, Candlestick, Histogram etc. and `svg` is used for the `XXXTooltip`, `MousePointer`, `XAxis` `YAxis` and the `EdgeIndicator`
1. add `jsnext:main` to `package.json` for use with [rollup](https://github.com/rollup/rollup)

#### Breaking Changes in v0.2

1. Axes are now accesible via `ReStock.axes.XAxis`, `ReStock.axes.YAxis` against `ReStock.XAxis`, `ReStock.YAxis` in 0.1.x
1. No more `react-stockchart.css`. The stylesheet is no longer used. All the styling has been moved to the individual components. If you prefer to have different style attributes you can use the style related  properties of the individual components or create a custom stylesheet with the class defined in each component
1. 


---
