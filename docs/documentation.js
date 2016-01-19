"use strict";

import React from "react";
import ReactDOM from "react-dom";
import d3 from "d3";

import * as ReStock from "react-stockcharts";

var parseDate = d3.time.format("%Y-%m-%d").parse

import "stylesheets/re-stock";

import Nav from "lib/navbar";
import Sidebar from "lib/sidebar";
import MainContainer from "lib/main-container";
import MenuGroup from "lib/menu-group";
import MenuItem from "lib/MenuItem";

var pages = [
	require("lib/page/GettingStartedPage").default,
	require("lib/page/QuickStartExamplesPage").default,
	require("lib/page/OverviewPage").default,
	require("lib/page/AreaChartPage").default,
	require("lib/page/CandleStickChartPage").default,
	require("lib/page/VolumeHistogramPage").default,
	require("lib/page/MousePointerPage").default,
	require("lib/page/ZoomAndPanPage").default,
	require("lib/page/SvgVsCanvas").default,
	require("lib/page/MAOverlayPage").default,
	require("lib/page/BollingerBandOverlayPage").default,
	require("lib/page/EdgeCoordinatesPage").default,
	require("lib/page/CompareWithPage").default,
	require("lib/page/LotsOfDataPage").default,
	require("lib/page/UpdatingDataPage").default,
	require("lib/page/MACDIndicatorPage").default,
	require("lib/page/RSIIndicatorPage").default,
	require("lib/page/StochasticIndicatorPage").default,
	require("lib/page/ForceIndexIndicatorPage").default,
	require("lib/page/ElderRayIndicatorPage").default,
	require("lib/page/ElderImpulseIndicatorPage").default,
	require("lib/page/TrendLineInteractiveIndicatorPage").default,
	require("lib/page/FibonacciInteractiveIndicatorPage").default,
	require("lib/page/ClickHandlerCallbackPage").default,
	require("lib/page/BrushSupportPage").default,
	require("lib/page/HeikinAshiPage").default,
	require("lib/page/KagiPage").default,
	require("lib/page/PointAndFigurePage").default,
	require("lib/page/RenkoPage").default,
	require("lib/page/CreatingCustomIndicatorPage").default,
	require("lib/page/CreatingCustomChartSeriesPage").default,
	require("lib/page/MiscChartsPage").default,
	require("lib/page/DarkThemePage").default,
	require("lib/page/ChangeLogPage").default,
	require("lib/page/ComingSoonPage").default,
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

d3.tsv("data/MSFT_full.tsv", (err2, MSFTFull) => {
	d3.tsv("data/MSFT.tsv", (err, MSFT) => {
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
	// KagiWithUpdatingData
	// RenkoWithUpdatingData
	// PointAndFigureWithUpdatingData
	// CandleStickChartWithInteractiveIndicator
	// CandleStickChartWithFibonacciInteractiveIndicator
	// AreaChartWithZoomPan
	// AreaChartWithPointsAndEdge
	// CandleStickChartWithForceIndexIndicator
	// OHLCChartWithElderRayIndicator
	// OHLCChartWithElderImpulseIndicator
	var Chart = require("lib/charts/OHLCChartWithElderImpulseIndicator").default;
	var TypeChooser = ReStock.helper.TypeChooser;

	// data, dataFull, compareData
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