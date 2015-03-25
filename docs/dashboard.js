'use strict';
/**/
var React = require('react');
var d3 = require('d3');
var parseDate = d3.time.format("%Y-%m-%d").parse

require('styles/react-stockcharts');
require('stylesheets/re-stock');

var Nav = require('lib/navbar');
var Sidebar = require('lib/sidebar');
var MainContainer = require('lib/main-container');
var MenuGroup = require('lib/menu-group');
var MenuItem = require('lib/menu-item');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');
var ScrollMixin = require('lib/scroll-mixin');


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

	var AreaChart = require('./lib/examples/areachart').init(data);
	var AreaChartWithYPercent = require('./lib/examples/areachart-with-ypercent').init(data);
	var AreaChartWithCrossHairMousePointer = require('./lib/examples/areachart-with-crosshair-mousepointer').init(data);
	var AreaChartWithVerticalMousePointer = require('./lib/examples/areachart-with-mousepointer').init(data);
	var AreaChartWithToolTip = require('./lib/examples/areachart-with-tooltip').init(data);
	var AreaChartWithMA = require('./lib/examples/areachart-with-ma').init(data);
	var AreaChartWithEdgeCoordinates = require('./lib/examples/areachart-with-edge-coordinates').init(data);
	var LineChart = require('./lib/examples/linechart').init(data);
	var CandleStickChart = require('./lib/examples/candlestickchart').init(data);
	var CandleStickStockScaleChart = require('./lib/examples/candlestickchart-stockscale').init(data);
	var SyncMouseMove = require('./lib/examples/synchronized-mouse-move').init(data);
	var AreaChartWithZoom = require('./lib/examples/areachart-with-zoom').init(data);
	var AreaChartWithZoomPan = require('./lib/examples/areachart-with-zoom-and-pan').init(data);

	var ExamplesPage = React.createClass({
		mixins: [ScrollMixin],
		render() {
			return (
				<body>
					<Nav />
					<MainContainer>
						<Sidebar>
							<MenuGroup>
								<MenuItem label="Overview" active={true} />
								<MenuItem label="AreaChart" />
								<MenuItem label="CandlestickChart" />
								<MenuItem label="stocktime/financetime scale" />
								<MenuItem label="LineChart2" />
								<MenuItem label="LineChart3" />
								<MenuItem label="LineChart4" />
							</MenuGroup>
						</Sidebar>
						<ContentSection title="Getting Started">
							<Row title="Overview">
								<Section  colSpan={2}>
									<aside dangerouslySetInnerHTML={{__html: require('md/OVERVIEW')}}></aside>
								</Section>
							</Row>
							<Row title="AreaChart">
								<Section colSpan={2} className="react-stockchart">
									<AreaChart />
								</Section>
							</Row>
							<Row>
								<Section colSpan={2}>
									<aside dangerouslySetInnerHTML={{__html: require('md/AREACHART')}}></aside>
								</Section>
							</Row>
							<Row>
								<Section colSpan={2} className="react-stockchart">
									<AreaChartWithYPercent />
								</Section>
							</Row>
							<Row title="CandlestickChart">
								<Section colSpan={2} className="react-stockchart">
									<CandleStickChart />
								</Section>
							</Row>
							<Row>
								<Section colSpan={2}>
									<aside dangerouslySetInnerHTML={{__html: require('md/CANDLESTICK')}}></aside>
								</Section>
							</Row>
							<Row>
								<Section colSpan={2} className="react-stockchart">
									<CandleStickStockScaleChart />
								</Section>
							</Row>
							<Row>
								<Section colSpan={2}>
									<aside dangerouslySetInnerHTML={{__html: require('md/CANDLESTICK-IMPROVED')}}></aside>
								</Section>
							</Row>
							<Row title="stocktime/financetime scale">
								<Section colSpan={2}>
									<aside dangerouslySetInnerHTML={{__html: require('md/FINANCETIMESCALE')}}></aside>
								</Section>
							</Row>
						</ContentSection>
					</MainContainer>
				</body>
			);
		}
	});

	React.render(<ExamplesPage />, document.body);
});
// React.render(<ExamplesPage />, document.getElementById("area"));

//module.exports = ExamplesPage;
