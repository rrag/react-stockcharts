## v0.4.x

1. Drop support for React 0.13 and use React 0.14, fix all the deprecation warnings
1. Provide touch support
1. Create an alternative for stockscale similar to the one created in [d3fc](https://github.com/ScottLogic/d3fc) with a discontinuty provider for weekends
1. `EdgeCoordinate` to take `fill` property as function or string
#### New Chart types
1. Scatter chart

#### Internal changes
1. Use stateless components in `RSISeries`, `StochasticSeries` to address react/prop-types lint error

## v0.5.x

1. Automatic Support & Resistance trendlines
1. Create intra day scale
1. Interactive indicators should be able to subscribe to more events (drag, zoom, pan)

#### New Chart types
1. Volume Profile
1. Max Drawdown
1. Scatter chart

## v0.6.x

#### New Chart types
1. Better Renko/Mean Renko
1. Line break
