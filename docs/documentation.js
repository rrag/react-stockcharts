"use strict";

import React from "react";
import ReactDOM from "react-dom";
import d3 from "d3";

import ReStock from "react-stockcharts";

var parseDate = d3.time.format("%Y-%m-%d").parse
var parseDateTime = d3.time.format("%Y-%m-%d %H:%M:%S").parse

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
		require("lib/page/IntraDayContiniousDataPage").default,
		require("lib/page/EquityIntraDayDataPage").default,
		require("lib/page/EdgeCoordinatesPage").default,
		require("lib/page/AnnotationsPage").default,
		require("lib/page/MouseFollowingTooltipPage").default,
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
		require("lib/page/VolumeProfilePage").default,
		require("lib/page/VolumeProfileBySessionPage").default,
		require("lib/page/BuyAndSellSignalPage").default,
	] 
}
var ALGORITHMIC_INDICATORS = {
	head: "Algorithmic Indicators",
	pages: [
		require("lib/page/MovingAverageCrossoverAlgorithmPage").default,
		require("lib/page/MovingAverageCrossoverAlgorithmPage2").default,
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
	ALGORITHMIC_INDICATORS,
	INTERACTIVE,
	// CUSTOMIZATION, TODO
];

var pages = d3.merge(ALL_PAGES.map(_ => _.pages))

function compressString(string) {
	string = string.replace(/\s+/g, "_");
	string = string.replace(/[-&]/g, "_");
	string = string.replace(/_+/g, "_");
	string = string.replace(/[.]/g, "");
	string = string.toLowerCase();
	// console.log(string);
	return string
}

function parseData(parse) {
	return function (d) {
		d.date = parse(d.date);
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;

		return d
	}
}

if (!Modernizr.fetch || !Modernizr.promises) {
	require.ensure(["whatwg-fetch", "es6-promise"], function(require) {
		require("es6-promise");
		require("whatwg-fetch");
		loadPage();
	})
} else {
	loadPage();
}


function loadPage() {
	var promiseMSFT = fetch("data/MSFT.tsv")
		.then(response => response.text())
		.then(data => d3.tsv.parse(data, parseData(parseDate)))
	var promiseMSFTfull = fetch("data/MSFT_full.tsv")
		.then(response => response.text())
		.then(data => d3.tsv.parse(data, parseData(parseDate)));
	var promiseIntraDayContinious = fetch("data/bitfinex_xbtusd_1m.csv")
		.then(response => response.text())
		.then(data => d3.csv.parse(data, parseData(parseDateTime)))
	var promiseIntraDayDiscontinuous = fetch("data/MSFT_INTRA_DAY.tsv")
		.then(response => response.text())
		.then(data => d3.tsv.parse(data, parseData(d => new Date(+d))))
	var promiseCompare = fetch("data/comparison.tsv")
		.then(response => response.text())
		.then(data => d3.tsv.parse(data, d => {
			d = parseData(parseDate)(d);
			d.SP500Close = +d.SP500Close;
			d.AAPLClose = +d.AAPLClose;
			d.GEClose = +d.GEClose;
			return d;
		}))
	var promiseBubbleData = fetch("data/bubble.json")
		.then(response => response.json())
	var promiseBarData = fetch("data/barData.json")
		.then(response => response.json())
	var promisegroupedBarData = fetch("data/groupedBarData.json")
		.then(response => response.json())

	Promise.all([promiseMSFT, promiseMSFTfull, promiseIntraDayContinious, promiseIntraDayDiscontinuous, promiseCompare, promiseBubbleData, promiseBarData, promisegroupedBarData])
		.then(function (values) {
			var [MSFT, MSFTfull, intraDayContinious, intraDayDiscontinuous, compareData, bubbleData, barData, groupedBarData] = values;
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

			renderPage(MSFT, MSFTfull, intraDayContinious, intraDayDiscontinuous, compareData, bubbleData, barData, groupedBarData, horizontalBarData, horizontalGroupedBarData);
			// renderPartialPage(MSFT, MSFTfull, intraDayContinious, intraDayDiscontinuous, compareData, bubbleData, barData, groupedBarData, horizontalBarData, horizontalGroupedBarData);
		})

}

function renderPage(data, dataFull, intraDayContinious, intraDayDiscontinuous, compareData, bubbleData, barData, groupedBarData, horizontalBarData, horizontalGroupedBarData) {
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
								intraDayContiniousData={intraDayContinious}
								intraDayDiscontinuousData={intraDayDiscontinuous}
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


function renderPartialPage(data, dataFull, intraDayContinious, intraDayDiscontinuous, compareData, bubbleData, barData, groupedBarData, horizontalBarData, horizontalGroupedBarData) {

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
	// CandleStickChartForDiscontinuousIntraDay - intraDayDiscontinuous
	// CandleStickChartWithAnnotation
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
	var Chart = require("lib/charts/CandleStickChartForDiscontinuousIntraDay").default;
	var TypeChooser = ReStock.helper.TypeChooser;

	// data, dataFull, compareData
	class ExamplesPage extends React.Component {
		render() {
			return (
				<div>
					<TypeChooser type="hybrid">
						{(type) => <Chart data={intraDayDiscontinuous} type={type} />}
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