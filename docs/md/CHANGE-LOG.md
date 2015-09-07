## v0.2

#### Breaking Changes

1. `<DataTransform>` is now removed, Check out examples on how to use the new `dataTransform` property of `ChartCanvas`
1. `<OverlaySeries>` is now removed, and `<DataSeries>` is used in its place and also it no longer accepts `type` instead accepts an `indicator` prop. This will keep the `OverlaySeries` extensible for custom overlays too. This is a significant change as it combines indicators and overlays to be interchangable. Multiple `DataSeries` in the same `Chart` contribute to the same `scales`
1. `DataSeries` no longer accepts `xAccessor` instead, it is moved to `Chart`. Use of `xAccessor` on the `Chart` is for very simple usecases, since it does not benefit from the stock scale
1. Axes are now accesible via `ReStock.axes.XAxis`, `ReStock.axes.YAxis` against `ReStock.XAxis`, `ReStock.YAxis` in 0.1.x
1. No more `react-stockchart.css`. The stylesheet is no longer used. All the styling has been moved to the individual components. If you prefer to have different style attributes you can use the style related  properties of the individual components or create a custom stylesheet with the class defined in each component

#### Other changes

1. Pure React based `svg` axes. Both `XAxis` and `YAxis` do not use `d3` to render inside `componentDidMount` / `componentDidUpdate`
1. A new property `type` is added to `ChartCanvas` and it takes one of 2 values
	- `svg` which creates the chart using pure svg
	- `hybrid` which creates the chart using a combination of `svg` and `canvas`. `canvas` is used to draw the different series, like Line, Area, Candlestick, Histogram etc. and `svg` is used for the `XXXTooltip`, `MousePointer`, `XAxis` `YAxis` and the `EdgeIndicator`
1. add `jsnext:main` to `package.json` for use with [rollup](https://github.com/rollup/rollup)
1. Added new indicators/overlays Bollinger band, RSI, MACD

---
