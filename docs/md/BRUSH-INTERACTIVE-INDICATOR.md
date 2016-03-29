Similar to the click handler, here is Brush support

Note: `pan` actions will not trigger `click` events. they have to be subscribed separately. A feature not implemented yet.

```jsx
<Brush id={0} enabled={true} onBrush={ e => { console.log(e); } }/>
```

click to start, move to the end and click again

Open the dev tools console and see the output of brush

[source](https://github.com/rrag/react-stockcharts/blob/master/docs/lib/charts/CandleStickChartWithBrush.jsx), [block](http://bl.ocks.org/rrag/11c28c8e6612055ba8a7), [plunker](http://plnkr.co/edit/gist:11c28c8e6612055ba8a7?p=preview) of this example, search for `handleBrush` to see how to make the chart zoom in on brush complete
