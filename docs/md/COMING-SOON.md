## v0.4.x

1. (Done) Drop support for React 0.13 and use React 0.14, fix all the deprecation warnings
1. (Done) Provide touch support
1. (Done) Indicators derived from other indicators
1. (Done) use d3.functor for `ScatterSeries` and add an example

#### New Chart types
1. (Done) Scatter chart
1. (Almost Done, need example) StackedHistogram
1. Volume Profile
1. Line break
1. (Done) OHLC Chart

#### New Indicators
1. (Done) ATR
1. (Done, TODO add plunker) Force Index
1. (Done, TODO add plunker) Elder Ray
1. (Done) [Elder Impulse](http://stockcharts.com/school/doku.php?id=chart_school:chart_analysis:elder_impulse_system)
1. [Envelope](http://www.investopedia.com/terms/e/envelope.asp?optm=sa_v2)
1. [ATR Trailing stop](http://www.incrediblecharts.com/indicators/atr_average_true_range_trailing_stops.php)
1. [Chandelier Exit](http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:chandelier_exit)

#### Internal changes
1. Use stateless components in `RSISeries`, `StochasticSeries` to address react/prop-types lint error
1. remove dependency `object-assign` and add dependency `lodash.set`, `lodash.get`, `lodash.first`, `lodash.last`
1. (Done) use `d3.nest` for optimizing canvas draws for candlestick, histogram and scatter chart
1. (Done) Upgraded to use Babel 6 instead of 5
1. Change `StraightLine` to take a prop of type which defaults to `horizontal`

## v0.5.x

1. Refactor `EventHandler.jsx` and `ChartDataUtil.js` to be functional, avoid mutations
1. Create an alternative for stockscale similar to the one created in [d3fc](https://github.com/ScottLogic/d3fc) with a discontinuty provider for weekends
1. Automatic Support & Resistance trendlines
1. Create intra day scale
1. Interactive indicators should be able to subscribe to more events (drag, zoom, pan)
1. Zoom on y too
1. `EdgeCoordinate` to take `fill` property as function or string
1. Add a playground to see live updates
1. Programatic Buy & sell signals

#### New Chart types
1. Max Drawdown
1. Better Renko/Mean Renko
1. HLC Chart

## v0.6.x

Guess this can be `1.0.0`

1. Detailed documentation of each component and its props
1. Explore spliting project into multiple modules, one for each type of indicator, chart type
1. use d3 v4 individual modules


## Sometime in the future....

#### New Indicators (in no particular order or priority)
1. [ADX](http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:average_directional_index_adx)
1. [Aroon](http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:aroon)
1. [Williams %R](http://stockcharts.com/school/doku.php?id=chart_school%3Atechnical_indicators%3Awilliams_r)
1. [Volume Weighted Average Price ](http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:vwap_intraday)
1. [Momentum](http://www.incrediblecharts.com/indicators/momentum.php)
1. [Money flow](http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:money_flow_index_mfi)
1. [Ichimoku Clouds](http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:ichimoku_cloud)
1. [Parabolic SAR](http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:parabolic_sar)
1. [ZigZag](http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:zigzag)


[and more....](http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators)