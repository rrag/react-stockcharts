'use strict';
var React = require('react');
var EdgeCoordinate = require('./EdgeCoordinate')
var Utils = require('./utils/utils')

var VerticalMousePointer = React.createClass({
	contextTypes: {
		_height: React.PropTypes.number.isRequired,
		_mouseXY: React.PropTypes.array.isRequired,
		_xDisplayValue: React.PropTypes.string.isRequired,
	},
	shouldComponentUpdate(nextProps, nextState, nextContext) {
		return nextContext._mouseXY !== this.nextContext._mouseXY
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.VerticalMousePointer",
		}
	},
	render() {
		return (
			<g className={'crosshair '}>
				<EdgeCoordinate
					type="vertical"
					className="horizontal"
					show={true}
					x1={this.context._mouseXY[0]} y1={0}
					x2={this.context._mouseXY[0]} y2={this.context._height}
					coordinate={this.context._xDisplayValue}
					edgeAt={this.context._height}
					orient="bottom"
					/>
				
			</g>
		);
	}
});

module.exports = VerticalMousePointer;
