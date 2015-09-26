checkout the [source](https://gist.github.com/rrag/a27298bb7ae613d48ba2), [block](http://bl.ocks.org/rrag/a27298bb7ae613d48ba2), [plunker](http://plnkr.co/edit/gist:a27298bb7ae613d48ba2?p=preview) of this example

`Overlay`s share the scales of a `Chart` and contribute to the `domain` of the `Chart` they belong to.

In this chart we are introducing 

- Moving average on daily `close` as a `LineSeries`
- Moving average on daily `volume` as an `AreaSeries`
- Current item indicator as a circle over the different moving averages
- Moving average tooltip

Let us review each of these in a little more detail

#### Moving average on daily `close` as a `LineSeries`

```jsx
<DataSeries id={1} indicator={SMA} options={{ period: 20, pluck: "close" }}>
	<LineSeries/>
</DataSeries>
<DataSeries id={2} indicator={EMA} options={{ period: 20 }} >
	<LineSeries/>
</DataSeries>
<DataSeries id={3} indicator={EMA} options={{ period: 50 }} >
	<LineSeries/>
</DataSeries>
```

Multiple `DataSeries`, each with a unique numeric `id`

the `{EMA}` and `{SMA}` are from

```js
var { EMA, SMA } = ReStock.indicator;
```

these indicators are just functions which follow a set of rules (yet to be documented). This makes for some very extensible behavior and user can create custom indicators for their use.

`options` used to specify the moving average `period`, and `pluck` to specify attribute against which moving average is to be calculated. If not specified, `pluck` defaults to `close`

#### Moving average on daily `volume` as an `AreaSeries`

```jsx
<DataSeries id={0} yAccessor={(d) => d.volume}>
	<HistogramSeries fill={(d) => d.close > d.open ? "#6BA583" : "red"} />
</DataSeries>
<DataSeries id={1} indicator={SMA} options={{ period: 10, pluck:"volume" }} >
	<AreaSeries />
</DataSeries>
```

Similar to above

#### Current item indicator as a circle over the different moving averages

```jsx
<CurrentCoordinate forChart={1} forDataSeries={1} />
<CurrentCoordinate forChart={1} forDataSeries={2} />
<CurrentCoordinate forChart={1} forDataSeries={3} />
<CurrentCoordinate forChart={2} forDataSeries={0} />
<CurrentCoordinate forChart={2} forDataSeries={1} />
```

That was easy, right?

`forChart` and `forDataSeries` are self explanatory

#### Moving average tooltip

```jsx
<TooltipContainer>
	<OHLCTooltip forChart={1} origin={[-40, 0]}/>
	<MovingAverageTooltip forChart={1} onClick={(e) => console.log(e)} origin={[-38, 15]}/>
</TooltipContainer>
```

Open the dev console and see what is logged on click of the moving average tooltip