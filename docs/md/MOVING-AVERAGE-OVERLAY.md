checkout the [source](https://gist.github.com/rrag/a27298bb7ae613d48ba2), [block](http://bl.ocks.org/rrag/a27298bb7ae613d48ba2), [plunker](http://plnkr.co/edit/gist:a27298bb7ae613d48ba2?p=preview) of this example

`Overlay`s share the scales of a `Chart` and contribute to the `domain` of the `Chart` they belong to.

In this chart we are introducing 

- Moving average on daily `close` as a `LineSeries`
- Moving average on daily `volume` as an `AreaSeries`
- Current item indicator as a circle over the different moving averages
- Moving average tooltip

Let us review each of these in a little more detail

#### Moving average on daily `close` as a `LineSeries`

```html
<DataSeries yAccessor={CandlestickSeries.yAccessor} >
	<CandlestickSeries />
	<OverlaySeries id={0} indicator={EMA} options={{ period: 20, pluck: "close" }}>
		<LineSeries/>
	</OverlaySeries>
	<OverlaySeries id={1} indicator={EMA} options={{ period: 30 }} >
		<LineSeries/>
	</OverlaySeries>
	<OverlaySeries id={2} indicator={SMA} options={{ period: 50 }} >
		<LineSeries/>
	</OverlaySeries>
</DataSeries>
```

the `{EMA}` and `{SMA}` are from

`var { EMA, SMA } = ReStock.indicator;`

these indicators are just functions which follow a set of rules (yet to be documented). This makes for some very extensible behavior and user can create custom indicators for their use.

`type` indicates it is a simple moving average, `options` used to specify the moving average `period`, and `pluck` to specify attribute against which moving average is to be calculated. If not specified, `pluck` defaults to `close`

#### Moving average on daily `volume` as an `AreaSeries`

```html
<DataSeries yAccessor={(d) => d.volume} >
	<HistogramSeries className={(d) => d.close > d.open ? 'up' : 'down'} />
	<OverlaySeries id={3} indicator={SMA} options={{ period: 10, pluck:'volume' }} >
		<AreaSeries/>
	</OverlaySeries>
</DataSeries>
```

Similar to above

#### Current item indicator as a circle over the different moving averages

```html
<CurrentCoordinate forChart={1} forOverlay={0} />
<CurrentCoordinate forChart={1} forOverlay={1} />
<CurrentCoordinate forChart={1} forOverlay={2} />
<CurrentCoordinate forChart={2} forOverlay={3} />
<CurrentCoordinate forChart={2}/>
```

That was easy, right?

`forOverlay` is an optional attribute, and absense of that will default the `CurrentCoordinate` to display a circle on the main series. This only makes sense if the main series plots a single value on y. For `CandlestickSeries` as it plots 4 attributes, `CurrentCoordinate` is not valid for `CandlestickSeries`

#### Moving average tooltip

```html
<TooltipContainer>
	<OHLCTooltip forChart={1} origin={[-40, 0]}/>
	<MovingAverageTooltip forChart={1} onClick={(e) => console.log(e)} origin={[-38, 15]}/>
</TooltipContainer>
```

Open the dev console and see what is logged on click of the moving average tooltip