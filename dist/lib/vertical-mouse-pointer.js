'use strict';
var React = require('react/addons');
var EdgeCoordinate = require('./edge-coordinate')
var Utils = require('./utils/utils')

var VerticalMousePointer = React.createClass({displayName: "VerticalMousePointer",
	propTypes: {
		_height: React.PropTypes.number.isRequired,
		_width: React.PropTypes.number.isRequired,
		_mouseXY: React.PropTypes.array.isRequired,
		_xDisplayValue: React.PropTypes.string.isRequired,
		_yDisplayValue: React.PropTypes.string.isRequired,
		yAxisPad: React.PropTypes.number.isRequired
	},
	shouldComponentUpdate:function(nextProps, nextState) {
		return nextProps._mouseXY !== this.props._mouseXY
	},
	getDefaultProps:function() {
		return {
			namespace: "ReStock.VerticalMousePointer",
			yAxisPad: 10
		}
	},
	render:function() {
		return (
			React.createElement("g", {className: 'crosshair '}, 
				React.createElement(EdgeCoordinate, {
					type: "vertical", 
					className: "horizontal", 
					show: true, 
					x1: this.props._mouseXY[0], y1: 0, 
					x2: this.props._mouseXY[0], y2: this.props._height, 
					coordinate: this.props._xDisplayValue, 
					edgeAt: this.props._height, 
					orient: "bottom"}
					)
				
			)
		);
	}
});

module.exports = VerticalMousePointer;
