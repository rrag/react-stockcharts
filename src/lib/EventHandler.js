"use strict";

import React from "react";
import Utils from "./utils/utils";
import PureComponent from "./utils/PureComponent";
import ChartDataUtil from "./utils/ChartDataUtil";

import objectAssign from "object-assign";

function getLongValue(value) {
	if (value instanceof Date) {
		return value.getTime();
	}
	return value;
}

class EventHandler extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
		this.handleZoom = this.handleZoom.bind(this);
		this.handlePanStart = this.handlePanStart.bind(this);
		this.handlePan = this.handlePan.bind(this);
		this.handlePanEnd = this.handlePanEnd.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.deltaXY = this.deltaXY.bind(this);

		this.state = {
			focus: false,
			currentItems: [],
			show: false,
			mouseXY: [0, 0],
			panInProgress: false,
		};
	}
	deltaXY(dxy) {
		if (dxy) {
			this.setState({
				deltaXY: dxy
			});
		} else {
			return this.state.deltaXY;
		}
	}
	componentWillMount() {
		// console.log("EventHandler.componentWillMount");
		var { props, context } = this;
		var { data, initialDisplay, options, interval, dimensions } = props;

		var dataForInterval = data[interval];
		var mainChart = ChartDataUtil.getMainChart(props.children);
		var beginIndex = Math.max(dataForInterval.length - initialDisplay, 0);
		var plotData = dataForInterval.slice(beginIndex);

		var chartData = ChartDataUtil.getChartData(props, dimensions, plotData, data, options);

		this.setState({
			plotData: plotData,
			chartData: chartData,
			interval: this.props.interval,
			mainChart: mainChart,
			currentCharts: [mainChart]
		});
	}
	componentWillReceiveProps(props, context) {
		var { interval, chartData, plotData } = this.state;
		var { data, options, dimensions } = props;

		var dataForInterval = data[interval];
		var mainChart = ChartDataUtil.getMainChart(props.children);
		var mainChartData = chartData.filter((each) => each.id === mainChart)[0];
		var domainL = mainChartData.config.accessors.xAccessor(plotData[0]);
		var domainR = mainChartData.config.accessors.xAccessor(plotData[plotData.length - 1]);
		var xAccessor = mainChartData.config.accessors.xAccessor;

		var beginIndex = Utils.getClosestItemIndexes(dataForInterval, domainL, xAccessor).left;
		var endIndex = Utils.getClosestItemIndexes(dataForInterval, domainR, xAccessor).right;

		// console.log(plotData[0], plotData[plotData.length - 1]);
		var newPlotData = dataForInterval.slice(beginIndex, endIndex);
		// console.log(newPlotData[0], newPlotData[newPlotData.length - 1]);
		var newChartData = ChartDataUtil.getChartData(props, dimensions, newPlotData, data, options);
		// console.log("componentWillReceiveProps");
		this.setState({
			chartData: newChartData,
			plotData: newPlotData,
			currentItems: [],
			show: false,
			mouseXY: [0, 0],
			mainChart: mainChart
		});
	}
	getChildContext() {
		return {
			plotData: this.state.plotData,
			chartData: this.state.chartData,
			currentItems: this.state.currentItems,
			mainChart: this.state.mainChart,
			show: this.state.show,
			mouseXY: this.state.mouseXY,
			interval: this.state.interval,
			currentCharts: this.state.currentCharts,
			width: this.props.dimensions.width,
			height: this.props.dimensions.height,
			type: this.props.type,
			dateAccessor: this.props.options.dateAccessor,

			onMouseMove: this.handleMouseMove,
			onMouseEnter: this.handleMouseEnter,
			onMouseLeave: this.handleMouseLeave,
			onZoom: this.handleZoom,
			onPanStart: this.handlePanStart,
			onPan: this.handlePan,
			onPanEnd: this.handlePanEnd,
			onFocus: this.handleFocus,
			deltaXY: this.deltaXY,
			panInProgress: this.state.panInProgress,
			focus: this.state.focus
		};
	}
	handleMouseMove(mouseXY) {
		// console.log("mouse move - ", mouseXY);
		var currentItems = ChartDataUtil.getCurrentItems(this.state.chartData, mouseXY, this.state.plotData);
			// .filter((eachChartData) => eachChartData.id === this.state.mainChart)
		var currentCharts = this.state.chartData.filter((chartData) => {
			var top = chartData.config.origin[1];
			var bottom = top + chartData.config.height;
			return (mouseXY[1] > top && mouseXY[1] < bottom);
		}).map((chartData) => chartData.id);

		// console.log(currentCharts);

		this.setState({
			mouseXY: mouseXY,
			currentItems: currentItems,
			show: true,
			currentCharts: currentCharts
		});
	}
	handleMouseEnter() {
		// console.log("enter");
		this.setState({
			show: true
		});
	}
	handleMouseLeave() {
		// console.log("leave");
		this.setState({
			show: false
		});
	}
	handleZoom(zoomDirection, mouseXY) {
		// console.log("zoomDirection ", zoomDirection, " mouseXY ", mouseXY);
		var { mainChart, chartData, plotData, interval } = this.state;
		var { data } = this.props;

		var chart = chartData.filter((eachChart) => eachChart.id === mainChart)[0],
			item = ChartDataUtil.getClosestItem(plotData, mouseXY, chart),
			xScale = chart.plot.scales.xScale,
			domain = xScale.domain(),
			centerX = chart.config.accessors.xAccessor(item),
			leftX = centerX - domain[0],
			rightX = domain[1] - centerX,
			zoom = Math.pow(1 + Math.abs(zoomDirection) / 2, zoomDirection),
			domainL = (getLongValue(centerX) - ( leftX * zoom)),
			domainR = (getLongValue(centerX) + (rightX * zoom)),
			domainRange = Math.abs(domain[1] - domain[0]),
			fullData = data[interval],
			last = fullData[fullData.length - 1],
			first = fullData[0];

		domainL = Math.max(getLongValue(chart.config.accessors.xAccessor(first)) - Math.floor(domainRange / 3), domainL);
		domainR = Math.min(getLongValue(chart.config.accessors.xAccessor(last)) + Math.floor(domainRange / 3), domainR);

		var dataToPlot = ChartDataUtil.getDataToPlotForDomain(domainL, domainR, data, chart.config.width, chart.config.accessors.xAccessor);
		if (dataToPlot.data.length < 10) return;
		var newChartData = chartData.map((eachChart) => {
			var plot = ChartDataUtil.getChartPlotFor(eachChart.config, dataToPlot.data, domainL, domainR);
			return {
				id: eachChart.id,
				config: eachChart.config,
				plot: plot
			};
		});
		this.setState({
			chartData: newChartData,
			plotData: dataToPlot.data,
			interval: dataToPlot.interval
		});
	}

	handlePanStart(panStartDomain, panOrigin) {
		// console.log("panStartDomain - ", panStartDomain, ", panOrigin - ", panOrigin);
		this.setState({
			panInProgress: true,
			panStartDomain: panStartDomain,
			panOrigin: panOrigin,
			focus: true,
		});
	}
	handlePan(mousePosition, startDomain) {
		// console.log("mousePosition ", mousePosition);
		/* can also use plotData, use this if you want to pan and show only within that data set*/
		var { mainChart, chartData, interval, panStartDomain, panOrigin } = this.state;
		var { data } = this.props;
		if (panStartDomain === null) {
			this.handlePanStart(startDomain, mousePosition);
		} else {
			requestAnimationFrame(() => {
				var chart = chartData.filter((eachChart) => eachChart.id === mainChart)[0],
					domainRange = panStartDomain[1] - panStartDomain[0],
					fullData = data[interval],
					last = fullData[fullData.length - 1],
					first = fullData[0],
					dx = mousePosition[0] - panOrigin[0],
					xAccessor = chart.config.accessors.xAccessor;

				// console.log("pan -- mouse move - ", mousePosition, " dragged by ", dx, " pixels");

				var domainStart = getLongValue(panStartDomain[0]) - dx / chart.config.width * domainRange;
				if (domainStart < getLongValue(xAccessor(first)) - Math.floor(domainRange / 3)) {
					domainStart = getLongValue(xAccessor(first)) - Math.floor(domainRange / 3);
				} else {
					domainStart = Math.min(getLongValue(xAccessor(last))
						+ Math.ceil(domainRange / 3), domainStart + domainRange) - domainRange;
				}
				var domainL = domainStart, domainR = domainStart + domainRange;
				if (panStartDomain[0] instanceof Date) {
					domainL = new Date(domainL);
					domainR = new Date(domainR);
				}

				var beginIndex = Utils.getClosestItemIndexes(fullData, domainL, xAccessor).left;
				var endIndex = Utils.getClosestItemIndexes(fullData, domainR, xAccessor).right;

				var filteredData = fullData.slice(beginIndex, endIndex);

				var newChartData = chartData.map((eachChart) => {
					var plot = ChartDataUtil.getChartPlotFor(eachChart.config, filteredData, domainL, domainR);
					return {
						id: eachChart.id,
						config: eachChart.config,
						plot: plot
					};
				});
				var currentItems = ChartDataUtil.getCurrentItems(newChartData, mousePosition, filteredData);

				var currentCharts = newChartData.filter((eachChartData) => {
					var top = eachChartData.config.origin[1];
					var bottom = top + eachChartData.config.height;
					return (mousePosition[1] > top && mousePosition[1] < bottom);
				}).map((eachChartData) => eachChartData.id);

				this.setState({
					chartData: newChartData,
					plotData: filteredData,
					currentItems: currentItems,
					// show: true,
					mouseXY: mousePosition,
					currentCharts: currentCharts,
				});
			});
		}
	}
	handlePanEnd() {
		this.setState({
			panInProgress: false,
			panStartDomain: null
		});
	}
	handleFocus(focus) {
		// console.log(focus);
		this.setState({
			focus: focus,
		});
	}
	render() {
		var children = React.Children.map(this.props.children, (child) => {
			var newChild = Utils.isReactVersion13()
				? React.withContext(this.getChildContext(), () => {
					return React.createElement(child.type, objectAssign({ key: child.key, ref: child.ref}, child.props));
				})
				: React.cloneElement(child);
			return newChild;
		});
		return (
			<g>{children}</g>
		);
	}
}

EventHandler.childContextTypes = {
	plotData: React.PropTypes.array,
	chartData: React.PropTypes.array,
	currentItems: React.PropTypes.array,
	show: React.PropTypes.bool,
	mouseXY: React.PropTypes.array,
	interval: React.PropTypes.string,
	currentCharts: React.PropTypes.array,
	mainChart: React.PropTypes.number,
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
	dateAccessor: React.PropTypes.func,

	onMouseMove: React.PropTypes.func,
	onMouseEnter: React.PropTypes.func,
	onMouseLeave: React.PropTypes.func,
	onZoom: React.PropTypes.func,
	onPanStart: React.PropTypes.func,
	onPan: React.PropTypes.func,
	onPanEnd: React.PropTypes.func,
	panInProgress: React.PropTypes.bool.isRequired,
	focus: React.PropTypes.bool.isRequired,
	onFocus: React.PropTypes.func,
	deltaXY: React.PropTypes.func,
};

module.exports = EventHandler;
