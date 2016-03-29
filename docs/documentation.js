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

var DOCUMENTATION = {
	head: "Documentation",
	pages: [
		// require("lib/page/GettingStartedPage").default,
		// require("lib/page/QuickStartExamplesPage").default,
		require("lib/page/OverviewPage").default,
		require("lib/page/SvgVsCanvasPage").default,
		require("lib/page/LotsOfDataPage").default,
		require("lib/page/ChangeLogPage").default,
		require("lib/page/ComingSoonPage").default,
	]
};

var CHART_TYPES = {
	head: "Chart types",
	pages: [
		require("lib/page/AreaChartPage").default,
		require("lib/page/LineAndScatterChartPage").default,
		require("lib/page/BubbleChartPage").default,
		require("lib/page/BarChartPage").default,
		require("lib/page/GroupedBarChartPage").default,
		require("lib/page/StackedBarChartPage").default,
		require("lib/page/HorizontalBarChartPage").default,
		require("lib/page/HorizontalStackedBarChartPage").default,
		require("lib/page/CandleStickChartPage").default,
		require("lib/page/VolumeBarPage").default,
		// TODO add OHLC chart 
		require("lib/page/HeikinAshiPage").default,
		require("lib/page/KagiPage").default,
		require("lib/page/PointAndFigurePage").default,
		require("lib/page/RenkoPage").default,
		require("lib/page/MiscChartsPage").default,
	]
};

var CHART_FEATURES = {
	head: "Chart features",
	pages: [
		require("lib/page/MousePointerPage").default,
		require("lib/page/ZoomAndPanPage").default,
		require("lib/page/EdgeCoordinatesPage").default,
		require("lib/page/UpdatingDataPage").default,
		require("lib/page/DarkThemePage").default,
	]
}

var INDICATORS = {
	head: "Indicators",
	pages: [
		require("lib/page/MAOverlayPage").default,
		require("lib/page/BollingerBandOverlayPage").default,
		require("lib/page/CompareWithPage").default,
		require("lib/page/MACDIndicatorPage").default,
		require("lib/page/RSIIndicatorPage").default,
		require("lib/page/StochasticIndicatorPage").default,
		require("lib/page/ForceIndexIndicatorPage").default,
		require("lib/page/ElderRayIndicatorPage").default,
		require("lib/page/ElderImpulseIndicatorPage").default,
	] 
}

var INTERACTIVE = {
	head: "Interactive",
	pages: [
		require("lib/page/TrendLineInteractiveIndicatorPage").default,
		require("lib/page/FibonacciInteractiveIndicatorPage").default,
		require("lib/page/ClickHandlerCallbackPage").default,
		require("lib/page/BrushSupportPage").default,
	]
}

var CUSTOMIZATION = {
	head: "Customization",
	pages: [
		require("lib/page/CreatingCustomIndicatorPage").default,
		require("lib/page/CreatingCustomChartSeriesPage").default,
	]
}

var ALL_PAGES = [
	DOCUMENTATION,
	CHART_TYPES,
	CHART_FEATURES,
	INDICATORS,
	INTERACTIVE,
	// CUSTOMIZATION, TODO
];

var pages = d3.merge(ALL_PAGES.map(_ => _.pages))

function compressString(string) {
	string = string.replace(/\s+/g, "_");
	string = string.replace(/[-&]/g, "_");
	string = string.replace(/_+/g, "_");
	string = string.toLowerCase();
	// console.log(string);
	return string
}

function renderPage(data, dataFull, compareData, bubbleData, barData, groupedBarData, horizontalBarData, horizontalGroupedBarData) {
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
				}, _ => window.scrollTo(0, 0));
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
							{ALL_PAGES.map((eachGroup, i) => 
								<div key={i}>
									<h4>{eachGroup.head}</h4>
									<MenuGroup>
										{eachGroup.pages.map((eachPage, idx) => <MenuItem key={idx} current={eachPage === this.state.selectedPage} title={eachPage.title} anchor={compressString(eachPage.title)} />)}
									</MenuGroup>
								</div>
							)}
						</Sidebar>
						<Page someData={data}
								lotsOfData={dataFull}
								compareData={compareData}
								bubbleData={bubbleData}
								barData={barData}
								groupedBarData={groupedBarData}
								horizontalBarData={horizontalBarData}
								horizontalGroupedBarData={horizontalGroupedBarData}/>
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
			d3.json("data/bubble.json", (err4, bubbleData) => {
				d3.json("data/barData.json", (err5, barData) => {
					d3.json("data/groupedBarData.json", (err6, groupedBarData) => {
						var horizontalBarData = barData.map(({x, y}) => ({ x: y, y: x }))
						var horizontalGroupedBarData = groupedBarData.map(d => {
								return {
									y: d.x,
									x1: d.y1,
									x2: d.y2,
									x3: d.y3,
									x4: d.y4,
								}
							});

						renderPage(MSFT, MSFTFull, compareData, bubbleData, barData, groupedBarData, horizontalBarData, horizontalGroupedBarData);
						// renderPartialPage(MSFT, MSFTFull, compareData, bubbleData, barData, groupedBarData, horizontalBarData);
					});
				});
			})
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

function renderPartialPage(data, dataFull, compareData, bubbleData, barData, groupedBarData) {
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
	// CandleStickStockScaleChartWithVolumeBarV1
	// CandleStickStockScaleChartWithVolumeBarV2
	// CandleStickStockScaleChartWithVolumeBarV3
	// CandleStickChartWithCHMousePointer
	// CandleStickChartWithZoomPan
	// CandleStickChartWithMA
	// CandleStickChartWithBollingerBandOverlay
	// CandleStickChartWithEdge
	// CandleStickChartWithCompare
	// CandleStickChartWithEdge  - Lots of data -> data={dataFull}/>
	// CandleStickChartWithUpdatingData
	// KagiWithUpdatingData
	// RenkoWithUpdatingData
	// PointAndFigureWithUpdatingData
	// CandleStickChartWithMACDIndicator
	// CandleStickChartWithRSIIndicator
	// CandleStickChartWithFullStochasticsIndicator
	// CandleStickChartWithForceIndexIndicator
	// OHLCChartWithElderRayIndicator
	// OHLCChartWithElderImpulseIndicator
	// CandleStickChartWithInteractiveIndicator
	// CandleStickChartWithFibonacciInteractiveIndicator
	// CandleStickChartWithBrush
	// CandleStickChartWithClickHandlerCallback
	// CandleStickChartWithDarkTheme
	// AreaChartWithZoomPan
	// AreaChartWithPointsAndEdge
	// HaikinAshi
	// Kagi
	// PointAndFigure
	// Renko
	var Chart = require("lib/charts/CandleStickChartWithFullStochasticsIndicator").default;
	var TypeChooser = ReStock.helper.TypeChooser;

	// data, dataFull, compareData
	class ExamplesPage extends React.Component {
		render() {
			return (
				<div>
					<TypeChooser type="hybrid">
						{(type) => <Chart data={data} type={type} />}
					</TypeChooser>
				</div>
			)
		}
	};

	/*
					<TypeChooser type="svg">
						{(type) => <Chart data={data} type={type} />}
					</TypeChooser>
	*/
	ReactDOM.render(<ExamplesPage />, document.getElementById("chart-goes-here"));
}