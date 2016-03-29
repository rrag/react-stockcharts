There have been a few requests about handling click callback. Here is how it can be done.

This component listens to the `click` event. Note: `pan` actions will not trigger `click` events. they have to be subscribed separately. A feature not implemented yet.

```jsx
<ClickCallback id={0} enabled={true} onClick={ e => { console.log(`mouse position = ${e.mouseXY}`, e); } }/>
```

Open the dev tools console and see the output of click

[source](https://github.com/rrag/react-stockcharts/blob/master/docs/lib/charts/CandleStickChartWithClickHandlerCallback.jsx), [block](http://bl.ocks.org/rrag/67894a887e52891aa2a3), [plunker](http://plnkr.co/edit/gist:67894a887e52891aa2a3?p=preview) of this example
