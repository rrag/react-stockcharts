"use strict";
var React = require('react');
var Utils = require('../utils/utils');

var Freezer = require('freezer-js');

function getLongValue(value) {
	if (value instanceof Date) {
		return value.getTime();
	}
	return value;
}

var EventCaptureMixin = {
	childContextTypes: {
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
	},
	getChildContext() {
		return {
			onMouseMove: this.handleMouseMove,
			onMouseEnter: this.handleMouseEnter,
			onMouseLeave: this.handleMouseLeave,
			onZoom: this.handleZoom,
			onPanStart: this.handlePanStart,
			onPan: this.handlePan,
			onPanEnd: this.handlePanEnd,
			onFocus: this.handleFocus,
			panInProgress: this.state.panInProgress,
			focus: this.state.focus
		}
	},
	handleMouseMove(mouseXY) {
		// console.log('mouse move - ', mouseXY);
		var currentItems = this.getCurrentItems(this.state._chartData, mouseXY, this.state._data)
			// .filter((eachChartData) => eachChartData.id === this.state.mainChart)

		this.setState({
			_mouseXY: mouseXY,
			_currentItems: currentItems,
			_show: true
		});
	},
	getCurrentItems(chartData, mouseXY, _data) {
		return chartData
			.map((eachChartData) => {
				var xValue = eachChartData.plot.scales.xScale.invert(mouseXY[0]);
				var item = Utils.getClosestItem(_data, xValue, eachChartData.config.accessors.xAccessor);
				return { id: eachChartData.id, data: item };
			});
	},
	handleMouseEnter() {
		// console.log('enter');
		this.setState({
			_show: true
		});
	},
	handleMouseLeave() {
		// console.log('leave');
		this.setState({
			_show: false
		});
	},
	handleZoom(zoomDirection, mouseXY) {
		// console.log('zoomDirection ', zoomDirection, ' mouseXY ', mouseXY);
		var { mainChart, _chartData, data, _data, interval } = this.state;

		var chart = _chartData.filter((eachChart) => eachChart.id === mainChart)[0],
			item = this.getClosestItem(mouseXY, chart),
			xScale = chart.plot.scales.xScale,
			domain = xScale.domain(),
			centerX = chart.config.accessors.xAccessor(item),
			leftX = centerX - domain[0],
			rightX = domain[1] - centerX,
			zoom = Math.pow(1 + Math.abs(zoomDirection)/2 , zoomDirection),
			domainL = (getLongValue(centerX) - ( leftX * zoom)),
			domainR = (getLongValue(centerX) + (rightX * zoom)),
			domainRange = Math.abs(domain[1] - domain[0]),
			fullData = data[interval],
			last = fullData[fullData.length - 1],
			first = fullData[0];

		domainL = Math.max(getLongValue(chart.config.accessors.xAccessor(first)) - Math.floor(domainRange/3), domainL)
		domainR = Math.min(getLongValue(chart.config.accessors.xAccessor(last)) + Math.floor(domainRange/3), domainR)
		// xScale(domainR) - xScale(domainL)
		var dataToPlot = this.getDataToPlotForDomain(domainL, domainR, data, chart.config.width, chart.config.accessors.xAccessor);
		if (dataToPlot.data.length < 10) return;
		var newChartData = _chartData.map((eachChart) => {
			var plot = this.getChartPlotFor(eachChart.config, dataToPlot.data, domainL, domainR);
			return {
				id: eachChart.id,
				config: eachChart.config,
				plot: plot
			}
		});
		this.setState({
			_chartData: newChartData,
			_data: dataToPlot.data,
			interval: dataToPlot.interval
		});
	},
	getDataToPlotForDomain(domainL, domainR, data, width, xAccessor) {
		var threshold = 0.5 // number of datapoints per 1 px
		var allowedIntervals = ['D', 'W', 'M'];
		// console.log(domainL, domainR, data, width);

		var dataForInterval, filteredData, interval, leftX, rightX;
		for (var i=0; i<allowedIntervals.length; i++) {
			interval = allowedIntervals[i]; 
			dataForInterval = data[interval];

			leftX = Utils.getClosestItemIndexes(dataForInterval, domainL, xAccessor);
			rightX = Utils.getClosestItemIndexes(dataForInterval, domainR, xAccessor);

			filteredData = dataForInterval.slice(leftX.right, rightX.right);

			// console.log(filteredData.length, width * threshold);
			if (filteredData.length < width * threshold) break;
		}

		// console.log(leftX, rightX,  (dd[leftX.left]), xAccessor(dd[rightX.right])); 

		return {
			interval: interval,
			data: filteredData
		}
	},
	handlePanStart(panStartDomain, panOrigin) {
		// console.log('panStartDomain - ', panStartDomain, ', panOrigin - ', panOrigin);
		this.setState({
			panInProgress: true,
			panStartDomain: panStartDomain,
			panOrigin: panOrigin,
			focus: true,
		});
	},
	handlePan(mousePosition, startDomain) {
		// console.log('mousePosition ', mousePosition);
		var { mainChart, _chartData, data, _data, interval, panStartDomain, panOrigin } = this.state;
		if (panStartDomain === null) {
			this.handlePanStart(startDomain, mousePosition);
		} else {
			requestAnimationFrame(() => {
				

				var chart = _chartData.filter((eachChart) => eachChart.id === mainChart)[0],
					domainRange = panStartDomain[1] - panStartDomain[0],
					fullData = data[interval],
					last = fullData[fullData.length - 1],
					first = fullData[0],
					dx = mousePosition[0] - panOrigin[0],
					xAccessor = chart.config.accessors.xAccessor;

				// console.log('pan -- mouse move - ', mousePosition, ' dragged by ', dx, ' pixels');

				var domainStart = getLongValue(panStartDomain[0]) - dx/chart.config.width * domainRange
				if (domainStart < getLongValue(xAccessor(first)) - Math.floor(domainRange/3)) {
					domainStart = getLongValue(xAccessor(first)) - Math.floor(domainRange/3)
				} else {
					domainStart = Math.min(getLongValue(xAccessor(last))
						+ Math.ceil(domainRange/3), domainStart + domainRange) - domainRange;
				}
				var domainL = domainStart, domainR = domainStart + domainRange
				if (panStartDomain[0] instanceof Date) {
					domainL = new Date(domainL);
					domainR = new Date(domainR);
				}

				var leftX = Utils.getClosestItemIndexes(fullData, domainL, xAccessor);
				var rightX = Utils.getClosestItemIndexes(fullData, domainR, xAccessor);

				var filteredData = fullData.slice(leftX.right, rightX.right);

				var newChartData = _chartData.map((eachChart) => {
					var plot = this.getChartPlotFor(eachChart.config, filteredData, domainL, domainR);
					return {
						id: eachChart.id,
						config: eachChart.config,
						plot: plot
					}
				});
				var _currentItems = this.getCurrentItems(newChartData, mousePosition, filteredData);

				this.setState({
					_chartData: newChartData,
					_data: filteredData,
					_currentItems: _currentItems,
					// _show: true,
					_mouseXY: mousePosition
				});
			});
		}
	},
	handlePanEnd() {
		this.setState({
			panInProgress: false,
			panStartDomain: null
		});
	},
	handleFocus(focus) {
		// console.log(focus);
		this.setState({
			focus: focus,
		});
	}
};

module.exports = EventCaptureMixin;
