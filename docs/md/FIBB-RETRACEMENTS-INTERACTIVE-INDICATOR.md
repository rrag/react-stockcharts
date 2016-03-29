```jsx
<FibonacciRetracement id={0} enabled={true} />
```

inside a `Chart` creates an interactive Fibonacci retracement for that `Chart`

other props of interest

`shouldRemoveLastIndicator` defaults to `(e) => (e.button === 2 && e.ctrlKey)` -- mouse right click **and** holding the ctrl key while click -- to remove the last drawn indicator

[source](https://github.com/rrag/react-stockcharts/blob/master/docs/lib/charts/CandleStickChartWithFibonacciInteractiveIndicator.jsx), [block](http://bl.ocks.org/rrag/82bc46e6566618e429d9), [plunker](http://plnkr.co/edit/gist:82bc46e6566618e429d9?p=preview)
