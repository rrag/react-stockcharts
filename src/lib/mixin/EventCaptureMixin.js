"use strict";
var React = require('react');
var Utils = require('../utils/utils');

var Freezer = require('freezer-js');

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
		// console.log('panInProgress - ', this.state.panInProgress);
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
		};
	},
	handleMouseMove(mouseXY) {
		console.log('mouse move - ', mouseXY);
		var currentItems = this.state._chartData
			// .filter((eachChartData) => eachChartData.id === this.state.mainChart)
			.map((eachChartData) => {
				var xValue = eachChartData.scales.xScale.invert(mouseXY[0]);
				var item = Utils.getClosestItem(this.state._data, xValue, eachChartData.accessors.xAccessor);
				return { id: eachChartData.id, data: item };
			});
		this.setState({
			_mouseXY: mouseXY,
			_currentItems: currentItems
		});
	},
	handleMouseEnter() {
		console.log('enter');
		this.setState({
			_show: true
		});
	},
	handleMouseLeave() {
		console.log('leave');
		this.setState({
			_show: false
		});
	},
	handleZoom(zoomDirection) {
		console.log('zoomDirection ', zoomDirection);
	},
	handlePanStart(panStartDomain) {
		console.log('panStartDomain - ', panStartDomain);
		this.setState({
			panInProgress: true,
			panStartDomain: panStartDomain,
			focus: true,
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
		console.log(focus);
		this.setState({
			focus: focus,
		});
	}
};

module.exports = EventCaptureMixin;
