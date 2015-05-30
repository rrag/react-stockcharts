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
	},
	getChildContext() {
		console.log('panInProgress - ', this.state.panInProgress);
		return {
			onMouseMove: this.handleMouseMove,
			onMouseEnter: this.handleMouseEnter,
			onMouseLeave: this.handleMouseLeave,
			onZoom: this.handleZoom,
			onPanStart: this.handlePanStart,
			onPan: this.handlePan,
			onPanEnd: this.handlePanEnd,
			panInProgress: this.state.panInProgress
		};
	},
	handleMouseMove(mousePosition) {
		console.log('mouse move - ', mousePosition);
		// set up _xDisplayValue, _yDisplayValue
		/*this.setState({
			_mouseXY: mousePosition,
		});*/
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
			panStartDomain: panStartDomain
		});
	},
	handlePan(mousePosition) {
		console.log('pan -- mouse move - ', mousePosition);
	},
	handlePanEnd() {
		this.setState({
			panInProgress: false,
			panStartDomain: null
		});
	}
};

module.exports = EventCaptureMixin;
