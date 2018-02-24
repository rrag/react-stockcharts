## v0.7.0
Details available in https://github.com/rrag/react-stockcharts/issues/206


## v0.6.1

#### New features

1. Weighted Moving Average indicator PR [#200](https://github.com/rrag/react-stockcharts/pull/200)- Thank you [@mgeri](https://github.com/mgeri)
1. Triangular Moving Average indicator PR [#204](https://github.com/rrag/react-stockcharts/pull/204)- Thank you [@mgeri](https://github.com/mgeri)
1. SAR indicator

#### Bug fixes

1. [#196](https://github.com/rrag/react-stockcharts/issues/196) - Add `clip` property (default = true) to `BarSeries`, `CandlestickSeries`, `ElderRaySeries`, `MACDSeries`, `OHLCSeries`, `OverlayBarSeries`, `PointAndFigureSeries`, `RenkoSeries`, `StackedBarSeries`
1. [#203](https://github.com/rrag/react-stockcharts/issues/203) - Filter out bars which have invalid y values


## v0.6.0

#### Breaking Changes

1. `EventCapture` is now removed. This is because starting `0.6` zoom actions can happen by drag on the x/y axis also, and that is a separate container, so having a single `EventCapture` is not possible
1. `CurrentCoordinate`, `MouseCoordinateX`, `MouseCoordinateY` no longer require an `id` prop
1. `TooltipContainer` is removed and all the tooltips (`OHLCTooltip`, `MovingAverageTooltip`)  are now moved inside the `Chart` relative to which you specify the origin. This also makes the `forChart` prop on the different `XXXTooltip` unnecessary
1. `ElderRaySeries` no longer accepts a `calculator` prop but instead an `accessor`

#### New features

1. Zoom on y
1. Pan on y
1. Support for pan to load more data
1. Click, Right click, Doubleclick handlers on `LineSeries` - This can serve as a model for other series
1. Add `tickStrokeDasharray` - [#183](https://github.com/rrag/react-stockcharts/pull/183) and [documentation](http://rrag.github.io/react-stockcharts/documentation.html#/line_scatter)
1. Control the number of datapoints/px - [#192](https://github.com/rrag/react-stockcharts/pull/192)
1. Hovertooltip now autosizes based on the content - [#189](https://github.com/rrag/react-stockcharts/pull/189)
1. Smooth zoom - [#160](https://github.com/rrag/react-stockcharts/pull/160)
1. More markers for a scatter chart - [#172](https://github.com/rrag/react-stockcharts/pull/172)

#### Contributors
Please welcome [@shprink](https://github.com/shprink) as a new contributor.

#### Internal Changes

1. Upgrade to `d3` individual modules

## v0.5.0

#### Breaking Changes

1. Removed `financeEODDiscontinuousScale` and replaced by a new discontinuous scale which supports both eod and intraday - Thank you [@brobits](https://github.com/brobits)
    
    in `0.4`

        <ChartCanvas ...
            discontinous xScale={financeEODDiscontinuousScale()}
            ...>

    in `0.5`

        <ChartCanvas ...
            xScaleProvider={discontinuousTimeScaleProvider}
            ...>

    `discontinous` prop is also removed. However should you choose to use any of the scales provided by d3, you can use them without any changes from `0.4`

    in `0.4`

        <ChartCanvas ...
            xScale={d3.time.scale()}
            ...>

    in `0.5`

        <ChartCanvas ...
            xScale={d3.time.scale()}
            ...>

    no changes here when using an existing d3 scale, `xScaleProvider` is useful only when you have to work with a discontinuous scale

1. Removed `MouseCoordinates`, use `MouseCoordinateX`, `MouseCoordinateY` and `CrossHairCursor` together to get similar results. Breaking out one component into multiple gave a lot more flexibility and also helps in removing the awkward props `yMousePointerDisplayLocation`, `yMousePointerDisplayFormat` from `Chart`
1. Removed `yMousePointerDisplayLocation`, `yMousePointerDisplayFormat` from `Chart`, Use `MouseCoordinateY` instead
1. Interactive indicators are `svg` only. This is most likely a transitional change till they get rewritten again in a future version to support canvas, be on the lookout for another possibly breaking change on interactive indicators

    Interactive indicators are no longer placed inside a `Chart`, they live inside `EventCapture`. Placing them on top of the event capture `rect` has helped in making [#94](https://github.com/rrag/react-stockcharts/issues/94) possible

    in `0.4`

        <ChartCanvas ...>
            <Chart id={0} ...>
                ...
                <TrendLine ... />
                ...
            </Chart>
            ...
            <EventCapture ... />
            ...
        </ChartCanvas>

    in `0.5`

        <ChartCanvas ...>
            <Chart id={0} ...>
                ...
            </Chart>
            ...
            <EventCapture ... >
                <TrendLine forChart={0} ... />
            </EventCapture>
            ...
        </ChartCanvas>

    look for more details in the [documentation](#/trendline) page


#### New features

1. Support both React `0.14` and React `15`
1. Annotations for events [#54](https://github.com/rrag/react-stockcharts/issues/54) - [more details](#/annotations)
1. Buy & sell signals using Annotation - [more](#/ma_crossover_using_text_annotation) [details](#/ma_crossover_using_svg_shape)
1. Labels - Look at how Chart title and axis labels [more details](#/annotations)
1. Hover tooltip - [more details](#/hover_tooltip)
1. intraday scale - [more details](#/intra_day_with_discontinuous_scale)
1. Better edge coordinate - [#79](https://github.com/rrag/react-stockcharts/pull/79) - Thank you [@cesardeazevedo](https://github.com/cesardeazevedo) - 
1. Volume profile - Refer to documentation for [volume profile](#/volume_profile) and [volume profile by session](#/volume_profile_by_session) Thank you [@aajtodd](https://github.com/aajtodd) for great documentation references

#### Contributors

I thank all the contributors for taking your time to help make this better

1. [@akinoniku](https://github.com/akinoniku) for [#88](https://github.com/rrag/react-stockcharts/pull/88)
1. [@brobits](https://github.com/brobits) for [#69](https://github.com/rrag/react-stockcharts/pull/69)
1. [@cesardeazevedo](https://github.com/cesardeazevedo) for [#79](https://github.com/rrag/react-stockcharts/pull/79), [#97](https://github.com/rrag/react-stockcharts/pull/97)

Special thanks to
[@rsklyar](https://github.com/rsklyar)
[@iNikNik](https://github.com/iNikNik)
[@Pinxie](https://github.com/Pinxie)
[@WaiSiuKei](https://github.com/WaiSiuKei)
[@itsjimbo](https://github.com/itsjimbo)
[@cesardeazevedo](https://github.com/cesardeazevedo)
[@aajtodd](https://github.com/aajtodd)
[@XmelesX](https://github.com/XmelesX)
[@raptoria](https://github.com/raptoria)
for your constant support, providing ideas for new features, suggestions for improvement and identifying defects


## v0.4.0

#### Breaking Changes

1. Drop support for React `0.13.x` and make `0.14.3` the default dependency
1. Major changes to API.
    - `DataSeries` is gone
    - all `indicator`s and `dataTransform`s are now gone, and are replaced by `calculator`
    - `setViewRange`, `pushData`, `alterData` were methods you could invoke from the ref of `ChartCanvas`. These are now gone, in favor of react style props for setting them
    - `ChartCanvas` now takes (among other things)
        - `xExtents` - indicates the domain of the x axis
        - `calculators` - indicates the calculators to be calculated on the data

    For a summary of changes, refer to [this issue](https://github.com/rrag/react-stockcharts/issues/48#issuecomment-174184639). Compare the examples [before (`0.3`)](https://github.com/rrag/react-stockcharts/tree/2af0c6e763ae960d40eb6c5406b4fe0ec8da2ac2/docs/lib/charts) and [after(`0.4`](https://github.com/rrag/react-stockcharts/tree/8386c424821907512b8e135a8a7fded3e5e09c83/docs/lib/charts)

1. All the `calculator`s, are written d3 style. (inspired by [d3fc](https://github.com/ScottLogic/d3fc))
1. `CompareSeries` is gone in favor of a calculator in its place. Refer to the examples for usage

#### New Features

1. Implement touch support, pan and pinch zoom
1. New Chart types Scatter, OHLC
1. New indicators - Elder impulse, Elder Ray, Force Index, ATR
1. Updated `TrendLine`, `FibonacciRetracement`, `Brush` to take `type` prop
1. Change `StraightLine` to take a prop of type which defaults to `horizontal`

#### Internal Changes

1. Inspired by [d3fc](https://github.com/ScottLogic/d3fc) change some of the internals
1. add dependency `lodash.fattendeep`
1. remove dependency `object-assign`

## v0.3.1

#### Changes

1. Fix [#39](https://github.com/rrag/react-stockcharts/issues/39)
1. Add eslint rules to prevent these from happening again
1. Change `utils.js` and `ChartDataUtil.js` to use es6 exports
1. fix `svg` for `Brush`

## v0.3.0

#### Breaking Changes

1. Changes to `Histogram` to accept `stroke` as a boolean param instead of a function. the `stroke` color cannot be different from `fill`
1. `OHLCTooltip` uses `d3.format(".4s")` as the format to show volume. This shows a suffix of M (Mega) for Million and G (Giga) for Billion. These are per the [SI-prefix](https://en.wikipedia.org/wiki/Metric_prefix). You can change it to a different format by passing a prop `volumeFormat` that accepts a function taking the volume and returning a formatted string

#### Changes

1. Add new methods to `ChartCanvas`
1. Add `Brush` and `ClickCallback` interactive components
1. Fix bug on zoom, for charts not using stockscale
1. Change to use ES6 module exports instead of commonjs `module.exports = ...`

## v0.2.12

#### Changes

1. Fixed a bug where `React` was not imported in `fitWidth`

## v0.2.11

#### Breaking Changes

1. Opacity works only when using Hex colors, using color names like `steelblue` `red` `black` is not recommended. This is to address #1 in [issue #22](https://github.com/rrag/react-stockcharts/issues/22)

#### Changes

1. Support for Dark theme

## v0.2.10

#### Changes

1. Create interactive indicators
    1. `FibonacciRetracement`
    1. `TrendLine`
1. Add a new prop `widthRatio` which takes values from 0 to 1 (defaults to 0.5) for `HistogramSeries` & `CandlestickSeries` to control the width
1. Add new tooltip `SingleValueTooltip`

## v0.2.9

#### Changes

1. Fix the moving average stroke color bug that was introduced from `v0.2.8`
1. Initial version of Interactive indicator `TrendLine`

## v0.2.8

#### Changes

1. Create a pure function instead of React Components extending PureComponent, this way the `componentWillReceiveProps` will not be called when no props are changed
1. Stop mutating the state of `EventHandler`, instead use a separate mutable state variable to hold a list of callbacks for drawing on canvas

## v0.2.6

#### Changes

1. Use `save-svg-as-png` `v1.0.1` instead of referring from source
1. Add onClick handler for all tooltips
1. Change onClick handler of `MovingAverageTooltip` to provide `chartId, dataSeriesId, options`

## v0.2.5

#### Changes

1. Use React 0.14.0 instead of 0.14.0-rc1
1. Add default yAccessor to Area & Line Series
1. Add checks for defensive iteration of children
1. Fix Kagi defect where volume is not reset
1. Add utility method to convert hex to rgba
1. Fix axes so svg and canvas result in near pixel perfect output
1. Round off x of Histogram so svg and canvas look similar
1. Change import in examples from ReStock to react-stockcharts
1. Add zIndex as property to ChartCanvas


## v0.2.4

#### Changes

1. Fix updating data for Kagi, Renko, P&F. Add examples [#17](https://github.com/rrag/react-stockcharts/issues/17)

## v0.2.3

#### Changes

1. Make it work with both react 0.13.3 & 0.14.0-rc1 [#12](https://github.com/rrag/react-stockcharts/issues/12)

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
