[source](https://github.com/rrag/react-stockcharts/blob/master/docs/lib/charts/CandleStickChartPanToLoadMore.js), [codesandbox](https://codesandbox.io/s/github/rrag/react-stockcharts-examples2/tree/master/examples/CandleStickChartPanToLoadMore)

ChartCanvas supports two function properties which can be used to load data.

`onLoadMore(start, end)` is called when the user scrolls or zooms past the first
data point provided. `start` and `end` are specified as indices on the data that
would be displayed in the new window.

`onZoomChange(start, end)` is called when the user performs a zoom event, and
can be used to change data intervals when the user zooms in or out. `start` and
`end` are specified as indices on the data that are be displayed in the new zoom.
