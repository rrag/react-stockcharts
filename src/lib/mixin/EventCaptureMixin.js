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

	handleMouseMove(mouseXY) {
		// console.log('mouse move - ', mouseXY);
		var currentItems = this.state._chartData
			// .filter((eachChartData) => eachChartData.id === this.state.mainChart)
			.map((eachChartData) => {
				var xValue = eachChartData.plot.scales.xScale.invert(mouseXY[0]);
				var item = Utils.getClosestItem(this.state._data, xValue, eachChartData.config.accessors.xAccessor);
				return { id: eachChartData.id, data: item };
			});
		this.setState({
			_mouseXY: mouseXY,
			_currentItems: currentItems,
			_show: true
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
		var dataToPlot = this.getDataToPlotForDomain(domainL, domainR, data, chart.plot.drawableWidth, chart.config.accessors.xAccessor);
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

			filteredData = dataForInterval.slice(leftX.left, rightX.right);

			// console.log(filteredData.length, width * threshold);
			if (filteredData.length < width * threshold) break;
		}

		// console.log(leftX, rightX,  (dd[leftX.left]), xAccessor(dd[rightX.right])); 

		return {
			interval: interval,
			data: filteredData
		}
	},
	handlePanStart(panStartDomain) {
		console.log('panStartDomain - ', panStartDomain);
		this.setState({
			panInProgress: true,
			panStartDomain: panStartDomain,
			focus: true,
			_show: false
		});
	},
	handlePan(mousePosition) {
		console.log('pan -- mouse move - ', mousePosition, ' pan start from ', this.state.panStartDomain);
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
