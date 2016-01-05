## v0.4.x

1. Drop support for React 0.13 and use React 0.14, fix all the deprecation warnings
1. Provide touch support
1. `EdgeCoordinate` to take `fill` property as function or string

#### New Chart types
1. Scatter chart

#### New Indicators
1. ATR
1. Force Index
1. Elder Ray

#### Internal changes
1. Use stateless components in `RSISeries`, `StochasticSeries` to address react/prop-types lint error

## v0.5.x

1. Create an alternative for stockscale similar to the one created in [d3fc](https://github.com/ScottLogic/d3fc) with a discontinuty provider for weekends
1. Automatic Support & Resistance trendlines
1. Create intra day scale
1. Interactive indicators should be able to subscribe to more events (drag, zoom, pan)

#### New Chart types
1. Volume Profile
1. Max Drawdown

## v0.6.x

#### New Chart types
1. Better Renko/Mean Renko
1. Line break

## v0.6.x

1. Explore spliting project into multiple modules, one for each type of indicator, chart type