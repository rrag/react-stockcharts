This example illustrates how to push new data points or alter existing data points to a chart after initial render.

There are 2 methods - `alterData` and `pushData` - exposed by `ChartCanvas` which can be accessed by `refs`

Add a `ref` to the `ChartCanvas`

```jsx
<ChartCanvas ref="chart" width={...} height={...} margin={...} dataTransform={...} data={...} type={...}>
	<Chart id={1} ...>
		<YAxis ... />
		<XAxis ... />
		<DataSeries ...>
			<CandlestickSeries />
		</DataSeries>
		<DataSeries ... >
			<LineSeries/>
		</DataSeries>
		...
</ChartCanvas>
```

Be sure to call these methods *after* the initial render.

```js
this.refs.chart.pushData( [ /* array of data to be pushed */ {...}, {...}, ... ] );
```
and

```js
this.refs.chart.alterData(data); // send the complete data. you have to ensure that the length of the original data passed and the new data sending here match in length
```

A live example below, Here are a keys to press to see the push and alter data2

key | outcome
----| -------
1   | push new data points
2   | alter the last candle
0   | stop all push/alter
+   | increase the speed
-   | reduce the speed

Example on plunker coming soon...