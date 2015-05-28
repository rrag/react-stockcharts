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
		onPan: React.PropTypes.func,
	},
	getChildContext() {
		console.log('333sfdf');
		return {
			onMouseMove: this.handleMouseMove,
			onMouseEnter: this.handleMouseEnter,
			onMouseLeave: this.handleMouseLeave,
			onZoom: this.handleZoom,
			onPan: this.handlePan
		};
	},
	handleMouseMove() {

	},
	handleMouseEnter() {
		this.setState({
			_show: true
		});
	},
	handleMouseLeave() {
		this.setState({
			_show: false
		});
	},
	handleZoom() {

	},
	handlePan() {

	}
};

module.exports = EventCaptureMixin;
