"use strict";

var React = require("react");
var ReactDOM = require("react-dom");
var d3 = require("d3");
var parseDate = d3.time.format("%Y-%m-%d").parse

require("stylesheets/re-stock");

var Nav = require("lib/navbar");
var Sidebar = require("lib/sidebar");
var MainContainer = require("lib/main-container");
var MenuGroup = require("lib/menu-group");
var MenuItem = require("lib/MenuItem");
var ReStock = require("src/");

var pages = [
	require("lib/page/GettingStartedPage"),
	require("lib/page/QuickStartExamplesPage"),
	require("lib/page/OverviewPage"),
	require("lib/page/AreaChartPage"),
	require("lib/page/CandleStickChartPage"),
	require("lib/page/VolumeHistogramPage"),
	require("lib/page/MousePointerPage"),
	require("lib/page/ZoomAndPanPage"),
	require("lib/page/SvgVsCanvas"),
	require("lib/page/MAOverlayPage"),
	require("lib/page/BollingerBandOverlayPage"),
	require("lib/page/EdgeCoordinatesPage"),
	require("lib/page/CompareWithPage"),
	require("lib/page/UpdatingDataPage"),
	require("lib/page/LotsOfDataPage"),
	require("lib/page/MACDIndicatorPage"),
	require("lib/page/RSIIndicatorPage"),
	require("lib/page/StochasticIndicatorPage"),
	require("lib/page/HeikinAshiPage"),
	require("lib/page/KagiPage"),
	require("lib/page/PointAndFigurePage"),
	require("lib/page/RenkoPage"),
	require("lib/page/CreatingCustomIndicatorPage"),
	require("lib/page/CreatingCustomChartSeriesPage"),
	require("lib/page/ChangeLogPage"),
	require("lib/page/ComingSoonPage"),
];

function compressString(string) {
	string = string.replace(/\s+/g, "_");
	string = string.replace(/[-&]/g, "_");
	string = string.replace(/_+/g, "_");
	string = string.toLowerCase();
	// console.log(string);
	return string
}
function renderPage(data, dataFull, compareData) {
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
	compareData.forEach((d, i) => {
		d.date = new Date(parseDate(d.date).getTime());
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;
		d.SP500Close = +d.SP500Close;
		d.AAPLClose = +d.AAPLClose;
		d.GEClose = +d.GEClose;
		// console.log(d);
	});

	var selected = location.hash.replace("#/", "");
	var selectedPage = pages.filter((page) => (compressString(page.title) === compressString(selected)));

	var firstPage = (selectedPage.length === 0) ? pages[0] : selectedPage[0];

	// console.log(selected, selectedPage, firstPage);
	class ExamplesPage extends React.Component {
		constructor(props) {
			super(props);
			this.handleRouteChange = this.handleRouteChange.bind(this);
			this.state = {
				selectedPage: firstPage
			}
		}
		handleRouteChange() {
			let selected = location.hash.replace("#/", "");
			let selectedPage = pages.filter((page) => (compressString(page.title) === compressString(selected)));
			if (selectedPage.length > 0) {
				this.setState({
					selectedPage: selectedPage[0]
				});
			}
		}
		componentDidMount() {
			window.addEventListener("hashchange", this.handleRouteChange, false);
		}
		render() {
			var Page = this.state.selectedPage;
			return (
				<div>
					<Nav />
					<MainContainer>
						<Sidebar>
							<MenuGroup>
								{pages.map((eachPage, idx) => <MenuItem key={idx} current={eachPage === this.state.selectedPage} title={eachPage.title} anchor={compressString(eachPage.title)} />)}
							</MenuGroup>
						</Sidebar>
						<Page someData={data} lotsOfData={dataFull} compareData={compareData} />
					</MainContainer>
				</div>
			);
		}
	};

	ReactDOM.render(<ExamplesPage />, document.getElementById("chart-goes-here"));
}

d3.tsv("data/MSFT.tsv", (err, MSFT) => {
	d3.tsv("data/MSFT_full.tsv", (err2, MSFTFull) => {
		d3.tsv("data/comparison.tsv", (err3, compareData) => {
			renderPage(MSFT, MSFTFull, compareData);
			// renderPartialPage(MSFT, MSFTFull, compareData);
		});
	});
});

/*document.addEventListener('keypress', function(e) {
	var keyCode = e.which;
	// b or s (98 or 115) - Begin performance
	// e (101) - end performance
	// l (108) - log performance
	console.log("pressed ", e.which);
	var Perf = React.addons.Perf;
	if (keyCode === 98 || keyCode === 115) {
		console.log("Perf.start()");
		Perf.start();
	} else if (keyCode === 101) {
		console.log("Perf.stop()");
		Perf.stop();
	} else if (keyCode === 108) {
		Perf.printInclusive();
		Perf.printExclusive();
		Perf.printWasted();
	}
})*/

function renderPartialPage(data, dataFull, compareData) {
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

	compareData.forEach((d, i) => {
		d.date = new Date(parseDate(d.date).getTime());
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;
		d.SP500Close = +d.SP500Close;
		d.AAPLClose = +d.AAPLClose;
		d.GEClose = +d.GEClose;
		// console.log(d);
	});

	//var Renko = require("./lib/charts/Renko").init(dataFull);
	// AreaChart
	// AreaChartWithYPercent
	// CandleStickChart
	// CandleStickStockScaleChart
	// CandleStickChartWithEdge
	// HaikinAshi
	// Kagi
	// PointAndFigure
	// Renko
	// CandleStickChartWithEdge  - Lots of data -> data={dataFull}/>
	// CandleStickChartWithCHMousePointer
	// CandleStickChartWithMA
	// CandleStickChartWithBollingerBandOverlay
	// CandleStickStockScaleChartWithVolumeHistogramV1
	// CandleStickStockScaleChartWithVolumeHistogramV2
	// CandleStickStockScaleChartWithVolumeHistogramV3
	// CandleStickChartWithZoomPan
	// CandleStickChartWithCompare
	// CandleStickChartWithMACDIndicator
	// CandleStickChartWithRSIIndicator
	// CandleStickChartWithFullStochasticsIndicator
	// CandleStickChartWithUpdatingData
	var Chart = require("lib/charts/CandleStickChartWithUpdatingData");
	var TypeChooser = ReStock.helper.TypeChooser;

	class ExamplesPage extends React.Component {
		render() {
			return (
				<TypeChooser type="hybrid">
					{(type) => <Chart data={data} type={type} />}
				</TypeChooser>
			)
		}
	};
	ReactDOM.render(<ExamplesPage />, document.getElementById("chart-goes-here"));
}