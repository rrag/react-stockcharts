'use strict';

var React = require('react');
var ReStock = require('../../../src/scripts/');

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
	componentWillMount() {
		//console.log(this.props);
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
	//mixins: [ReStock.ChartScalesMixin],
	render() {
		var data = [
			  { index: 0, open: 10, high: 20, low: 5, close: 10 }
			, { index: 1, open: 10, high: 20, low: 5, close: 20 }
			, { index: 2, open: 10, high: 20, low: 5, close: 30 }
			, { index: 3, open: 10, high: 20, low: 5, close: 30 }
			, { index: 4, open: 10, high: 20, low: 5, close: 20 }
			, { index: 5, open: 10, high: 20, low: 5, close: 2 }
			, { index: 6, open: 10, high: 20, low: 5, close: 8 }
			, { index: 7, open: 10, high: 20, low: 5, close: 50 }
			, { index: 8, open: 10, high: 20, low: 5, close: 25 }
		];
		// var xScale = this.calculateScales();
		// var yScale = this.yScale();
		return (
			<ChartCanvas  width={500} height={400}>
				<Translate ref="a" data={data}>
					<Chart>
						<DataSeries />
						<Dummy sup="World" />
						<Dummy sup="World2" />
						<Dummy sup="World3" />
					</Chart>
				</Translate>
				<g></g>
			</ChartCanvas>
		);
	}
});

module.exports = AreaChart

/*
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