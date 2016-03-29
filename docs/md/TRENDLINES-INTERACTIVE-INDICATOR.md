```jsx
<TrendLine id={0} enabled={true} snap={true} snapTo={d => [d.open, d.high, d.low, d.close]} />
```

inside a `Chart` creates an interactive trendline for that `Chart`

Review the source to see how to remove the last drawn trendline, and cancel a trendline

[source](https://github.com/rrag/react-stockcharts/blob/master/docs/lib/charts/CandleStickChartWithInteractiveIndicator.jsx), [block](http://bl.ocks.org/rrag/63f666ef1159691d76cc), [plunker](http://plnkr.co/edit/gist:63f666ef1159691d76cc?p=preview)