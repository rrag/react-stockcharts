'use strict';

var React = require('react');
var d3 = require('d3');

var ReStock = require('../../../src/scripts');

var ChartCanvas = ReStock.ChartCanvas
	, XAxis = ReStock.XAxis
	, YAxis = ReStock.YAxis
	, AreaSeries = ReStock.AreaSeries
	, Translate = ReStock.Translate
	, Chart = ReStock.Chart
	, DataSeries = ReStock.DataSeries;
;

var Dummy = React.createClass({
	statics: {
		namespace() {
			return "kkk";
		},
		mmm: "hey"
	},
	getDefaultProps() {
		return { 
			key: "Hello "
		};
	},
	getInitialState() {
		return { hello: "world"};
	},
	componentWillReceiveProps(nextProps) {
		//console.log(nextProps);
	},

	handleClick() {
		this.setState({a: 1});
	},
	render() {
		return (
			<g><rect height="100" width="200" onClick={this.handleClick}/></g>
		);
	}
});

var AreaChart = React.createClass({
	getInitialState() {
		return {};
	},
	componentWillMount() {
		var parseDate = d3.time.format("%Y-%m-%d").parse
		d3.tsv("data/data.tsv", function(err, data) {
			data.forEach((d, i) => {
				d.date = new Date(parseDate(d.date).getTime());
				d.open = +d.open;
				d.high = +d.high;
				d.low = +d.low;
				d.close = +d.close;
				d.volume = +d.volume;
				// console.log(d);
			});
			this.setState({ data : data });
		}.bind(this));
	},
	//mixins: [ReStock.ChartScalesMixin],
	render() {
		if (this.state.data === undefined) return null;
		var parseDate = d3.time.format("%Y-%m-%d").parse
		var dateRange = { from: parseDate("2012-06-01"), to: parseDate("2012-12-31")}

		return (
<ChartCanvas  width={500} height={400} margin={{left: 50, right: 50, top:10, bottom: 30}}>
	<Chart data={this.state.data} >
		<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
		<YAxis axisAt="right" orient="right" percentScale={true} tickFormat={d3.format(".0%")}/>
		<YAxis axisAt="left" orient="left" />
		<DataSeries yAccessor={(d) => d.close} xAccessor={(d) => d.date}>
			<AreaSeries />
		</DataSeries>
	</Chart>
</ChartCanvas>
		);
	}
});

module.exports = AreaChart

/*
<ChartCanvas  width={500} height={400} margin={{left: 50, right: 50, top:10, bottom: 30}}>
	<Chart data={this.state.data}>
		<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
		<YAxis axisAt="right" orient="right" percentScale={true} tickFormat={d3.format(".0%")}/>
		<YAxis axisAt="left" orient="left" />
		<DataSeries yAccessor={(d) => d.close} xAccessor={(d) => d.date}>
			<AreaSeries />
		</DataSeries>
	</Chart>
</ChartCanvas>
<ChartCanvas  width={500} height={400}>
	<Chart data={this.state.data} yScale={d3.scale.pow().exponent(0.15)}>
		<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
		<YAxis axisAt="left" orient="left"/>
		<DataSeries yAccessor={(d) => d.close} xAccessor={(d) => d.date}>
			<AreaSeries />
		</DataSeries>
	</Chart>
</ChartCanvas>
<ChartCanvas  width={500} height={400}>
	<Chart data={this.state.data} yScale={d3.scale.log()}>
		<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
		<YAxis axisAt="left" orient="left"/>
		<DataSeries yAccessor={(d) => d.close} xAccessor={(d) => d.date}>
			<AreaSeries />
		</DataSeries>
	</Chart>
</ChartCanvas>
<ChartCanvas  width={500} height={400}>
	<DataTransform data={this.state.data} interval="D"
		polyLinear={false}
		viewRange={dateRange}>
		<Chart>
			<XAxis axisAt="bottom" orient="bottom" ticks={4} tickFormat={d3.time.format("%b")}/>
			<YAxis axisAt={-10} orient="left"/>
			<DataSeries yAccessor={(d) => d.close} xAccessor={(d) => d.date}>
				<AreaSeries />
			</DataSeries>
		</Chart>
	</DataTransform>
</ChartCanvas>
<ChartCanvas  width={500} height={400}>
	<DataTransform data={this.state.data} interval="D"
		polyLinear={false}
		viewRange={dateRange}>
		<Chart>
			<XAxis axisAt="bottom" orient="bottom"/>
			<YAxis axisAt={-10} orient="left"/>
			<DataSeries yAccessor={(d) => d.close} xAccessor={(d) => d.date}>
				<AreaSeries />
			</DataSeries>
		</Chart>
	</DataTransform>
</ChartCanvas>
<ChartCanvas  width={500} height={400}>
	<DataTransform data={this.state.data}
		polyLinear={true}
		dateAccessor={(d) => d.date}>
		<Chart>
			<XAxis axisAt="bottom" orient="bottom"/>
			<YAxis axisAt={-10} orient="left"/>
			<DataSeries yAccessor={(d) => d.close}>
				<AreaSeries />
			</DataSeries>
		</Chart>
	</DataTransform>
</ChartCanvas>
<ChartCanvas  width={500} height={400}>
	<Chart data={this.state.data}>
		<XAxis axisAt="bottom" orient="bottom"/>
		<YAxis axisAt="left" orient="left"/>
		<DataSeries yAccessor={(d) => d.close} xAccessor={(d) => d.date}>
			<AreaSeries />
		</DataSeries>
	</Chart>
</ChartCanvas>
<ChartCanvas  width={500} height={400}>
	<Chart data={this.state.data} yScale={d3.scale.pow().exponent(.5)}>
		<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
		<YAxis axisAt="left" orient="left"/>
		<DataSeries yAccessor={(d) => d.close} xAccessor={(d) => d.date}>
			<AreaSeries />
		</DataSeries>
	</Chart>
</ChartCanvas>


<DataTransform data={} transformDataAs={POLYLINEAR}>
	<DataTransform transformDataAs={RENKO}>
		<Chart currentItemEmitter={} xScale={} yScale={} xDomainUpdate={true} yDomainUpdate={true}>
			<XAxis axisAt="bottom" orient="bottom"/>
			<YAxis axisAt="left" orient="left"/>
			<DataSeries yAccessor={} xAccesor={} tooltipDisplayEmitter={}>
				<CandlestickSeries/>
			</DataSeries
			<ChartOverlay type="sma" options={{ period: 10 }} xAccesor={} yAccesor={} toolTipId={}>
				<LineSeries />
			</ChartOverlay>
			<ChartOverlay type="macrossover" options={{ period: 10 }} id={0}> //moving average crossover
				<Markers />
			</ChartOverlay>
		</Chart>
	</DataTransform>
	<DataTransform transformDataAs={VOLUMEPROFILE}>
		<Chart xAccesor={} yAccesor={}>
			<YAxis />
			<LineSeries />
			<ChartOverlay type="sma" options={{ period: 10 }} id={0}>
				<LineSeries />
			</ChartOverlay>
			<TooltipEmitter sendUsing={} />
		</Chart>
	</DataTransform>
	<Chart xAccesor={} yAccesor={}>
		<YAxis />
		<HistogramSeries  />
		<EdgeCoordinate />
	</Chart>
	<MouseCoordinates listenTo={} /> // this is here so it is above all charts
	<EdgeCoordinate /> // this is here so it is above all charts and I can click and bring an edge coordinate to the front
	<EdgeCoordinate edgeAt="" orient="" />
	<EventCapture mouseMove={true} zoom={true} pan={true} />
	<TooltipContainer>
		<OHLCTooltip />
		<MovingAverageTooltipContainer>
			<MATooltip onClick={} onToggle={} onRemove={} toolTipId={} />
			<MATooltip toolTipId={} />
			<MATooltip toolTipId={} />
		</MovingAverageTooltipContainer>
	</TooltipContainer>
</DataTransform>
*/