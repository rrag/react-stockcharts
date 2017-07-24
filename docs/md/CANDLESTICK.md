[source](https://github.com/rrag/react-stockcharts/blob/master/docs/lib/charts/CandleStickChart.js), [codesandbox](https://codesandbox.io/s/github/rrag/react-stockcharts-examples2/tree/master/examples/CandleStickChart)

well, that looks ok, but something is not right. Look closer, you will find that the candles are not spread at regular intervals, there is a gap of say 2 candles every so often. That gap is because the data is plot on a continuous time scale, and a continuous time scale has week ends and national holidays, days when trading does not happen. Now we don't want to show non trading days on the chart. If it is an intra day chart, you want to see only 9:30 AM to 4:00 PM (or 1:00 PM if it is holiday hours)

What we need here is to show time that is not continuous on the x axis. Enter **financetime scale**.
