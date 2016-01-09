## v0.4.x

1. (Done) Drop support for React 0.13 and use React 0.14, fix all the deprecation warnings
1. (Done) Provide touch support
1. `EdgeCoordinate` to take `fill` property as function or string

#### New Chart types
1. (Done) Scatter chart

#### New Indicators
1. ATR
1. Force Index
1. Elder Ray

#### Internal changes
1. Use stateless components in `RSISeries`, `StochasticSeries` to address react/prop-types lint error
1. remove dependency to `object-assign`

## v0.5.x

1. Create an alternative for stockscale similar to the one created in [d3fc](https://github.com/ScottLogic/d3fc) with a discontinuty provider for weekends
1. Automatic Support & Resistance trendlines
1. Create intra day scale
1. Interactive indicators should be able to subscribe to more events (drag, zoom, pan)
1. Zoom on y too

#### New Chart types
1. Volume Profile
1. Max Drawdown
1. Better Renko/Mean Renko
1. Line break

## v0.6.x

Guess this can be `1.0.0`

1. Explore spliting project into multiple modules, one for each type of indicator, chart type
1. use d3 v4 individual modules