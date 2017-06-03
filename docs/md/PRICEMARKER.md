[source](https://github.com/rrag/react-stockcharts/blob/master/docs/lib/charts/CandleStickChartWithPriceMarkers.jsx), [block](http://bl.ocks.org/rrag/b13b739458e65ff93f4a), [plunker](http://plnkr.co/edit/gist:b13b739458e65ff93f4a?p=preview)

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
