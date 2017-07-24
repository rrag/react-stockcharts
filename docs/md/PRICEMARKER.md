[source](https://github.com/rrag/react-stockcharts/blob/master/docs/lib/charts/CandleStickChartWithPriceMarkers.js), [codesandbox](https://codesandbox.io/s/github/rrag/react-stockcharts-examples2/tree/master/examples/CandleStickChartWithPriceMarkers)


Demo shows how to set one, ore more, price markers a chart. The markers sticks to the price and will adjust with pan and zoom. To

To utilize this feature add one, or more, <PriceCoordinate> tags to a chart. See example below.

```jsx

<Chart id={1} yExtents={d => [d.high, d.low]}>
  <XAxis axisAt="bottom" orient="bottom" ticks={6}/>
  <YAxis axisAt="left" orient="left" ticks={5} />
  <PriceCoordinate
    at="left"
    orient="left"
    price={60}
    displayFormat={format(".2f")} />

  <PriceCoordinate
      at="left"
      orient="left"
      price={55}
      displayFormat={format(".2f")} />
  <CandlestickSeries />
</Chart>

```
