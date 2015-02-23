'use strict';

var React = require('react');
var d3 = require('d3');

var ReStock = require('../../../src/styles/main.scss');
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
		var dateFormat = d3.time.format("%Y-%m-%d");
		d3.tsv("data/data.tsv", function(err, data) {
			data.forEach((d, i) => {
				d.date = parseDate(d.date);
				d.open = +d.open;
				d.high = +d.high;
				d.low = +d.low;
				d.close = +d.close;
				d.volume = +d.volume;
			});
			this.setState({ data : data });
		}.bind(this));
	},
	//mixins: [ReStock.ChartScalesMixin],
	render() {
		if (this.state.data === undefined) return null;

		return (
<ChartCanvas  width={500} height={400}>
	<Translate data={this.state.data}
		polyLinear={true}
		dateAccessor={(d) => d.date}>
		<Chart>
			<XAxis axisAt="bottom" orient="bottom"/>
			<YAxis axisAt="left" orient="left"/>
			<DataSeries yAccessor={(d) => d.close}>
				<AreaSeries />
			</DataSeries>
		</Chart>
	</Translate>
</ChartCanvas>
		);
	}
});

module.exports = AreaChart

/*
<ChartCanvas  width={500} height={400}>
	<Translate data={this.state.data}
		polyLinear={true}
		dateAccessor={(d) => d.date}>
		<Chart>
			<XAxis axisAt="bottom" orient="bottom"/>
			<YAxis axisAt="left" orient="left"/>
			<DataSeries yAccessor={(d) => d.close}>
				<AreaSeries />
			</DataSeries>
		</Chart>
	</Translate>
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

<Translate data={} transformDataAs={} listenTo={} fromIndex={} toIndex={}>
	<Chart currentItemEmitter={} xScale={} yScale={} xDomainUpdate={true} yDomainUpdate={true}>
		<XAxis axisAt="bottom" orient="bottom"/>
		<YAxis axisAt="left" orient="left"/>
		<DataSeries yAccessor={} xAccesor={} tooltipDisplayEmitter={}>
			<CandlestickSeries/>
		</DataSeries
		<ChartOverlay type="sma" options={{ period: 10 }} xAccesor={} yAccesor={}>
			<LineSeries />
		</ChartOverlay>
		<ChartOverlay type="macrossover" options={{ period: 10 }} id={0}> //moving average crossover
			<Markers />
		</ChartOverlay>
	</Chart>
	<Chart xAccesor={} yAccesor={}>
		<YAxis />
		<LineSeries />
		<ChartOverlay type="sma" options={{ period: 10 }} id={0}>
			<LineSeries />
		</ChartOverlay>
		<TooltipEmitter sendUsing={} />
	</Chart>
	<Chart xAccesor={} yAccesor={}>
		<YAxis />
		<HistogramSeries  />
		<EdgeCoordinate />
	</Chart>
	<MouseCoordinates listenTo={} /> // this is here so it is above all charts
	<EdgeCoordinate /> // this is here so it is above all charts and I can click and bring an edge coordinate to the front
	<EdgeCoordinate edgeAt="" orient="" />
	<EventCapture actions={} />
	<Tooltip listenTo={currentItemStore} actions={} />
</Translate>
*/