## v0.2.2

#### Breaking Changes

1. Use react & react-dom 0.14.0-rc1 as dependency, added `peerDependency` to resolve [#12](https://github.com/rrag/react-stockcharts/issues/12)

#### Internal changes

1. Change the way chart series are developed so `context` is not used.

## v0.2.1

#### Breaking Changes

1. Use react 0.14.0-beta3 as dependency

#### Other changes

1. Improve the handling of the chart on [updating data](#/updating_data)
    1. provide a new `pushData` method to push new data points, and another `alterData` method to modify existing data. By creating these methods, it is easy to identify if a change to the Chart is due to data changes or change of height/width of the chart
1. Add example for serverside rendering
1. Add example for downloading chart as png - works for both canvas & svg

#### Internal changes

1. In an attempt to improve performance of pan actions on firefox, the pan actions when done for canvas now do not update the state during pan. To achieve this the following changes were done
    1. Create Canvas based X & YAxis
    1. Canvas based `EdgeCoordinates` and `MouseCoordinates` and `CurrentCoordinate`
    1. Create 2 canvas as against one for each chart.
        - One canvas that is redrawn on mouse move, this canvas contains the `MouseCoordinates`, `CurrentCoordinate`, and 
        - One canvas that is drawn on zoom or pan action, this contains everything else, including the `XAxis`, `YAxis`, the actual Chart series, `EdgeCoordinate`



## v0.2

#### Breaking Changes

1. `<DataTransform>` is now removed, Check out examples on how to use the new `dataTransform` property of `ChartCanvas`
1. `<OverlaySeries>` is now removed, and `<DataSeries>` is used in its place and also it no longer accepts `type` instead accepts an `indicator` prop. This will keep the `OverlaySeries` extensible for custom overlays too. This is a significant change as it combines indicators and overlays to be interchangable. Multiple `DataSeries` in the same `Chart` contribute to the same `scales`
1. `DataSeries` no longer accepts `xAccessor` instead, it is moved to `Chart`. Use of `xAccessor` on the `Chart` is for very simple usecases, since it does not benefit from the stock scale
1. Simple moving average and Exponential moving average are converted as indicators
1. Axes are now accesible via `ReStock.axes.XAxis`, `ReStock.axes.YAxis` against `ReStock.XAxis`, `ReStock.YAxis` in 0.1.x
1. No more `react-stockchart.css`. The stylesheet is no longer used. All the styling has been moved to the individual components. If you prefer to have different style attributes you can use the style related  properties of the individual components or create a custom stylesheet with the class defined in each component

#### Other changes

1. Pure React based `svg` axes. Both `XAxis` and `YAxis` do not use `d3` to render inside `componentDidMount` / `componentDidUpdate`
1. Added new indicators/overlays Bollinger band, RSI, MACD
1. A new property `type` is added to `ChartCanvas` and it takes one of 2 values
    - `svg` which creates the chart using pure svg
    - `hybrid` which creates the chart using a combination of `svg` and `canvas`. `canvas` is used to draw the different series, like Line, Area, Candlestick, Histogram etc. and `svg` is used for the `XXXTooltip`, `MousePointer`, `XAxis` `YAxis` and the `EdgeIndicator`
1. add `jsnext:main` to `package.json` for use with [rollup](https://github.com/rollup/rollup)

---
