
#### Indicators/Overlays

- ~~Exponential Moving Average (EMA)~~ - `v0.1`
- ~~Bolinger Bands~~ - `v0.2`
- ~~Moving Average Convergence Divergence (MACD)~~ - `v0.1`
- ~~Relative Strength Index (RSI)~~ - `v0.2`
- ~~Stochastics~~ - `v0.2`
- More indicators - suggestions welcome - `v0.5`

#### Chart types

- ~~Heikin Ashi~~ - `v0.1`
- ~~Kagi~~ - `v0.1`
- ~~Point and Figure~~ - `v0.1`
- ~~Renko~~ - `v0.1`
- Better Renko/Mean Renko - `v0.5`
- Line break - `v0.5`
- Volume Profile - `v0.4`
- Max Drawdown - `v0.4`

#### Chart features

- ~~Compare with another stock~~ - `v0.1`
- ~~Change interval on zoom out/zoom in~~ - `v0.1`
- ~~Add custom data transforms~~ - `v0.2`
- ~~Add custom indicators~~ - `v0.2`
- ~~Pure React axes~~ - `v0.2`
- ~~Provide option to use canvas instead of svg~~ - `v0.2`
- ~~Save chart as image~~ - `v0.2.1`
- ~~Render chart on server~~ - `v0.2.1`
- ~~Improve performance of pan in firefox~~ - `v0.2.1`
- ~~create a new mode `canvas` in addition to `svg` and `hybrid` eliminating all svg and use just canvas~~ (not doing) - `v0.3`
- ~~Create example for data updating at regular intervals~~ - `v0.2.1`
- Update `CurrentCoordinate` and `EdgeCoordinate` to deal with `DataSeries` which has a `yAccessor` which returns an object - `v0.3`
- Add example for a darker background - `v0.3`

#### Documentation

- ~~Explain how to create custom indicators~~ - `v0.2.2`
- ~~Explain how to create custom data series~~ - `v0.2.2`
- Explain how to create custom dataTransform - `v0.3`
- Explain how to create custom Interactive indicator - `v0.3`

#### More examples

- ~~gists, fiddle and [blocks](http://bl.ocks.org/) for each chart type~~ - `v0.1`

#### Open issues

- ~~Window Resize after zoom/pan messes up the chart~~
- ~~zoom out changes the interval, but zoom in does not change~~
- ~~Refactor pan and zoom~~

#### Tech Tasks

- Use ES6 Classes
    - ~~Do not use EventCaptureMixin, ChartContainerMixin~~
    - ~~Update examples to not use ChartWidthMixin~~ - Not doing
- ~~use babel~~
- ~~change require to import~~
- ~~execute lint & code style~~
- ~~not use JSXTransformer~~
- ~~Publish to npm - v0.1-alpha~~
- ~~Getting Started page with steps to get started via npm~~
- ~~remove esprima-fb~~
- ~~configure options for advanced chart types~~ - `v0.2`
- Add tests and coverage - `v0.4`

#### Dependencies
- ~~Experiment with React 0.13 instead of React 0.14~~ - `v0.1`
- ~~Remove Freezer-js dependency~~ - `v0.1`