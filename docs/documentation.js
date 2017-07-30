"use strict";

import React from "react";
import ReactDOM from "react-dom";

import { csvParse, tsvParse } from  "d3-dsv";
import { merge } from "d3-array";
import { timeParse } from "d3-time-format";

const parseDate = timeParse("%Y-%m-%d");
const parseDateTime = timeParse("%Y-%m-%d %H:%M:%S");


import { TypeChooser } from "react-stockcharts/lib/helper";
import "stylesheets/re-stock";

import Nav from "lib/navbar";
import Sidebar from "lib/sidebar";
import MainContainer from "lib/main-container";
import MenuGroup from "lib/menu-group";
import MenuItem from "lib/MenuItem";

const DOCUMENTATION = {
	head: "Documentation",
	pages: [
		// require("./lib/page/GettingStartedPage").default,
		// require("./lib/page/QuickStartExamplesPage").default,
		require("./lib/page/OverviewPage").default,
		require("./lib/page/SvgVsCanvasPage").default,
		require("./lib/page/LotsOfDataPage").default,
		require("./lib/page/ChangeLogPage").default,
		require("./lib/page/ComingSoonPage").default,
	]
};

const CHART_FEATURES = {
	head: "Chart features",
	pages: [
		require("./lib/page/MousePointerPage").default,
		require("./lib/page/ZoomAndPanPage").default,
		require("./lib/page/IntraDayContinuousDataPage").default,
		require("./lib/page/EquityIntraDayDataPage").default,
		require("./lib/page/EdgeCoordinatesPage").default,
		require("./lib/page/PriceMarkerPage").default,
		require("./lib/page/AnnotationsPage").default,
		require("./lib/page/MouseFollowingTooltipPage").default,
		require("./lib/page/UpdatingDataPageForCandleStick").default,
		require("./lib/page/LoadMoreDataPage").default,
		require("./lib/page/DarkThemePage").default,
		require("./lib/page/GridPage").default,
	]
};

const CHART_TYPES = {
	head: "Chart types",
	pages: [
		require("./lib/page/AreaChartPage").default,
		require("./lib/page/LineAndScatterChartPage").default,
		require("./lib/page/BubbleChartPage").default,
		require("./lib/page/BarChartPage").default,
		require("./lib/page/GroupedBarChartPage").default,
		require("./lib/page/StackedBarChartPage").default,
		require("./lib/page/HorizontalBarChartPage").default,
		require("./lib/page/HorizontalStackedBarChartPage").default,
		require("./lib/page/CandleStickChartPage").default,
		require("./lib/page/VolumeBarPage").default,
		// TODO add OHLC chart
		require("./lib/page/HeikinAshiPage").default,
		require("./lib/page/KagiPage").default,
		require("./lib/page/PointAndFigurePage").default,
		require("./lib/page/RenkoPage").default,
		require("./lib/page/MiscChartsPage").default,
	]
};

const INDICATORS = {
	head: "Indicators",
	pages: [
		require("./lib/page/MAOverlayPage").default,
		require("./lib/page/BollingerBandOverlayPage").default,
		require("./lib/page/CompareWithPage").default,
		require("./lib/page/MACDIndicatorPage").default,
		require("./lib/page/RSIIndicatorPage").default,
		require("./lib/page/StochasticIndicatorPage").default,
		require("./lib/page/ForceIndexIndicatorPage").default,
		require("./lib/page/ElderRayIndicatorPage").default,
		require("./lib/page/ElderImpulseIndicatorPage").default,
		require("./lib/page/SARIndicatorPage").default,
		require("./lib/page/VolumeProfilePage").default,
		require("./lib/page/VolumeProfileBySessionPage").default,
	]
};
const ALGORITHMIC_INDICATORS = {
	head: "Algorithmic Indicators",
	pages: [
		require("./lib/page/MovingAverageCrossoverAlgorithmPage").default,
		require("./lib/page/MovingAverageCrossoverAlgorithmPage2").default,
	]
};

const INTERACTIVE = {
	head: "Interactive",
	pages: [
		require("./lib/page/TrendLineInteractiveIndicatorPage").default,
		require("./lib/page/FibonacciInteractiveIndicatorPage").default,
		require("./lib/page/EquidistantChannelPage").default,
		require("./lib/page/StandardDeviationChannelPage").default,
		require("./lib/page/GannFanPage").default,
		require("./lib/page/TextPage").default,
		require("./lib/page/ClickHandlerCallbackPage").default,
		require("./lib/page/BrushSupportPage").default,
	]
};

const ALL_PAGES = [
	DOCUMENTATION,
	CHART_FEATURES,
	CHART_TYPES,
	INDICATORS,
	ALGORITHMIC_INDICATORS,
	INTERACTIVE,
	// CUSTOMIZATION, TODO
];

const pages = merge(ALL_PAGES.map(_ => _.pages));

function compressString(string) {
	string = string.replace(/\s+/g, "_");
	string = string.replace(/[-&]/g, "_");
	string = string.replace(/_+/g, "_");
	string = string.replace(/[.]/g, "");
	string = string.toLowerCase();
	// console.log(string);
	return string;
}

function parseData(parse) {
	return function(d) {
		d.date = parse(d.date);
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;

		return d;
	};
}

if (!window.Modernizr.fetch || !window.Modernizr.promises) {
	require.ensure(["whatwg-fetch", "es6-promise"], function(require) {
		require("es6-promise");
		require("whatwg-fetch");
		loadPage();
	});
} else {
	loadPage();
}


function loadPage() {
	const promiseMSFT = fetch("data/MSFT.tsv")
		.then(response => response.text())
		.then(data => tsvParse(data, parseData(parseDate)));
	const promiseMSFTfull = fetch("data/MSFT_full.tsv")
		.then(response => response.text())
		.then(data => tsvParse(data, parseData(parseDate)));
	const promiseIntraDayContinuous = fetch("data/bitfinex_xbtusd_1m.csv")
		.then(response => response.text())
		.then(data => csvParse(data, parseData(parseDateTime)))
		.then(data => {
			data.sort((a, b) => {
				return a.date.valueOf() - b.date.valueOf();
			});
			return data;
		});
	const promiseIntraDayDiscontinuous = fetch("data/MSFT_INTRA_DAY.tsv")
		.then(response => response.text())
		.then(data => tsvParse(data, parseData(d => new Date(+d))));
	const promiseCompare = fetch("data/comparison.tsv")
		.then(response => response.text())
		.then(data => tsvParse(data, d => {
			d = parseData(parseDate)(d);
			d.SP500Close = +d.SP500Close;
			d.AAPLClose = +d.AAPLClose;
			d.GEClose = +d.GEClose;
			return d;
		}));
	const promiseBubbleData = fetch("data/bubble.json")
		.then(response => response.json());
	const promiseBarData = fetch("data/barData.json")
		.then(response => response.json());
	const promisegroupedBarData = fetch("data/groupedBarData.json")
		.then(response => response.json());

	Promise.all([promiseMSFT, promiseMSFTfull, promiseIntraDayContinuous, promiseIntraDayDiscontinuous, promiseCompare, promiseBubbleData, promiseBarData, promisegroupedBarData])
		.then(function(values) {
			const [MSFT, MSFTfull, intraDayContinuous, intraDayDiscontinuous, compareData, bubbleData, barData, groupedBarData] = values;
			const horizontalBarData = barData.map(({ x, y }) => ({ x: y, y: x }));
			const horizontalGroupedBarData = groupedBarData.map(d => {
				return {
					y: d.x,
					x1: d.y1,
					x2: d.y2,
					x3: d.y3,
					x4: d.y4,
				};
			});


			renderPage(MSFT, MSFTfull, intraDayContinuous, intraDayDiscontinuous, compareData, bubbleData, barData, groupedBarData, horizontalBarData, horizontalGroupedBarData);
			// renderPartialPage(MSFT, MSFTfull, intraDayContinuous, intraDayDiscontinuous, compareData, bubbleData, barData, groupedBarData, horizontalBarData, horizontalGroupedBarData);
		});
}

function renderPage(data, dataFull, intraDayContinuous, intraDayDiscontinuous, compareData, bubbleData, barData, groupedBarData, horizontalBarData, horizontalGroupedBarData) {
	const selected = location.hash.replace("#/", "");
	const selectedPage = pages.filter((page) => (compressString(page.title) === compressString(selected)));

	const firstPage = (selectedPage.length === 0) ? pages[0] : selectedPage[0];

	// console.log(selected, selectedPage, firstPage);
	class ExamplesPage extends React.Component {
		constructor(props) {
			super(props);
			this.handleRouteChange = this.handleRouteChange.bind(this);
			this.state = {
				selectedPage: firstPage
			};
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
								intraDayContinuousData={intraDayContinuous}
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
	}

	ReactDOM.render(<ExamplesPage />, document.getElementById("chart-goes-here"));
}


function renderPartialPage(data, dataFull, intraDayContinuous, intraDayDiscontinuous, compareData, bubbleData, barData, groupedBarData, horizontalBarData, horizontalGroupedBarData) {

	// var Renko = require("./lib/charts/Renko").init(dataFull);
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
	// HeikinAshi
	// Kagi
	// PointAndFigure
	// Renko
	var Chart = require("./lib/charts/CandleStickChartWithZoomPan").default;
	// data, dataFull, compareData
	class ExamplesPage extends React.Component {
		render() {
			return (
				<div>
					<TypeChooser type="hybrid" style={{ position: "absolute", top: 40, bottom: 0, left: 0, right: 0 }}>
						{(type) => <Chart data={dataFull} type={type} />}
					</TypeChooser>
				</div>
			);
		}
	}

	/*
					<TypeChooser type="svg">
						{(type) => <Chart data={data} type={type} />}
					</TypeChooser>
	*/
	ReactDOM.render(<ExamplesPage />, document.getElementById("chart-goes-here"));
}
