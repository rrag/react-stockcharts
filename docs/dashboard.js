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

function renderPage(data, dataFull) {
	data.forEach((d, i) => {
		d.date = new Date(parseDate(d.date).getTime());
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;
		// console.log(d);
	});

	dataFull.forEach((d, i) => {
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
	var CandleStickStockScaleChart = require('./lib/examples/candlestickchart-stockscale').init(data);
	var CandleStickStockScaleChartWithVolumeHistogramV1 = require('./lib/examples/candlestickchart-with-volume-histogram').init(data);
	var CandleStickStockScaleChartWithVolumeHistogramV2 = require('./lib/examples/candlestickchart-with-volume-histogram2').init(data);
	var CandleStickChartWithCHMousePointer = require('./lib/examples/candlestickchart-with-crosshair').init(data);
	var CandleStickChartWithZoomPan = require('./lib/examples/candlestickchart-with-zoompan').init(data);
	var CandleStickChartWithMA = require('./lib/examples/candlestickchart-with-ma').init(data);
	var CandleStickChartWithEdge = require('./lib/examples/candlestickchart-with-edge').init(data);
	var CandleStickChartWithLotsOfData = require('./lib/examples/candlestickchart-with-edge').init(dataFull);
	var HeikinAshiChart = require('./lib/examples/HaikinAshi').init(data);
	var ExamplesPage = React.createClass({
		//mixins: [ScrollMixin],
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
								<MenuItem label="stocktime scale" />
								<MenuItem label="Volume histogram" />
								<MenuItem label="Mouse pointer" />
								<MenuItem label="Zoom and Pan" />
								<MenuItem label="Overlay" />
								<MenuItem label="Edge coordinate" />
								<MenuItem label="Lots of data" />
								<MenuItem label="Heikin Ashi" />
								<MenuItem label="Coming soon..." />
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
							<Row title="stocktime scale">
								<Section colSpan={2}>
									<aside dangerouslySetInnerHTML={{__html: require('md/FINANCETIMESCALE')}}></aside>
								</Section>
							</Row>
							<Row title="Volume histogram">
								<Section colSpan={2}>
									<aside dangerouslySetInnerHTML={{__html: require('md/VOLUME-HISTOGRAM-INTRO')}}></aside>
								</Section>
							</Row>
							<Row>
								<Section colSpan={2} className="react-stockchart">
									<CandleStickStockScaleChartWithVolumeHistogramV1 />
								</Section>
							</Row>
							<Row>
								<Section colSpan={2}>
									<aside dangerouslySetInnerHTML={{__html: require('md/VOLUME-HISTOGRAM')}}></aside>
								</Section>
							</Row>
							<Row>
								<Section colSpan={2} className="react-stockchart">
									<CandleStickStockScaleChartWithVolumeHistogramV2 />
								</Section>
							</Row>
							<Row>
								<Section colSpan={2}>
									<aside dangerouslySetInnerHTML={{__html: require('md/VOLUME-HISTOGRAM-Contd')}}></aside>
								</Section>
							</Row>
							<Row title="Mouse pointer">
								<Section colSpan={2} className="react-stockchart">
									<CandleStickChartWithCHMousePointer />
								</Section>
							</Row>
							<Row>
								<Section colSpan={2}>
									<aside dangerouslySetInnerHTML={{__html: require('md/MOUSEPOINTER')}}></aside>
								</Section>
							</Row>
							<Row title="Zoom and Pan">
								<Section colSpan={2} className="react-stockchart">
									<CandleStickChartWithZoomPan />
								</Section>
							</Row>
							<Row>
								<Section colSpan={2}>
									<aside dangerouslySetInnerHTML={{__html: require('md/ZOOM-AND-PAN')}}></aside>
								</Section>
							</Row>
							<Row title="Overlay">
								<Section colSpan={2} className="react-stockchart">
									<CandleStickChartWithMA />
								</Section>
							</Row>
							<Row>
								<Section colSpan={2}>
									<aside dangerouslySetInnerHTML={{__html: require('md/MOVING-AVERAGE-OVERLAY')}}></aside>
								</Section>
							</Row>
							<Row title="Edge coordinate">
								<Section colSpan={2} className="react-stockchart">
									<CandleStickChartWithEdge />
								</Section>
							</Row>
							<Row>
								<Section colSpan={2}>
									<aside dangerouslySetInnerHTML={{__html: require('md/EDGE-COORDINATE')}}></aside>
								</Section>
							</Row>
							<Row title="Lots of data">
								<Section colSpan={2}>
									<aside dangerouslySetInnerHTML={{__html: require('md/LOTS-OF-DATA')}}></aside>
								</Section>
							</Row>
							<Row>
								<Section colSpan={2} className="react-stockchart">
									<CandleStickChartWithLotsOfData />
								</Section>
							</Row>
							<Row>
								<h2>Advanced chart types</h2>
							</Row>
							<Row title="Heikin Ashi">
								<Section colSpan={2}>
									<aside dangerouslySetInnerHTML={{__html: require('md/HEIKIN-ASHI')}}></aside>
								</Section>
							</Row>
							<Row>
								<Section colSpan={2} className="react-stockchart">
									<HeikinAshiChart />
								</Section>
							</Row>
							<Row title="Coming soon...">
								<Section colSpan={2} className="react-stockchart">
									<aside dangerouslySetInnerHTML={{__html: require('md/COMING-SOON')}}></aside>
								</Section>
							</Row>
						</ContentSection>
					</MainContainer>
				</body>
			);
		}
	});

	React.render(<ExamplesPage />, document.body);
}
// React.render(<ExamplesPage />, document.getElementById("area"));

//module.exports = ExamplesPage;


d3.tsv("data/MSFT.tsv", (err, MSFT) => {
	d3.tsv("data/MSFT_full.tsv", (err2, MSFTFull) => {
		//renderPage(MSFT, MSFTFull);
		renderPartialPage(MSFT, MSFTFull);
	});
})

function renderPartialPage(data, dataFull) {
	data.forEach((d, i) => {
		d.date = new Date(parseDate(d.date).getTime());
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;
		// console.log(d);
	});

	dataFull.forEach((d, i) => {
		d.date = new Date(parseDate(d.date).getTime());
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;
		// console.log(d);
	});
	var HeikinAshiChart = require('./lib/examples/HaikinAshi').init(data);
	var ExamplesPage = React.createClass({
		//mixins: [ScrollMixin],
		render() {
			return (
				<body>
					<div className="container">
					<Row title="Heikin Ashi">
						<Section colSpan={2} className="react-stockchart">
							<HeikinAshiChart />
						</Section>
					</Row>
					</div>
				</body>
			)
		}
	});
	React.render(<ExamplesPage />, document.body);
}