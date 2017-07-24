Creating a dark background is simply modifying some of the props to use the colors you want. The important thing to note here is that `canvas` & `svg` are transparent, so the background is simply controlled by css. For the example below the background is configured as

```css
.dark {
    background: #303030;
}
```

There are multiple other properties which have to be customized to make the chart appear as below. see them all in the [source](https://github.com/rrag/react-stockcharts/blob/master/docs/lib/charts/CandleStickChartWithDarkTheme.js), [codesandbox](https://codesandbox.io/s/github/rrag/react-stockcharts-examples2/tree/master/examples/CandleStickChartWithDarkTheme) of this example
