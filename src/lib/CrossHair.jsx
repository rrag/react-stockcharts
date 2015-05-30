'use strict';
var React = require('react');
var EdgeCoordinate = require('./EdgeCoordinate')
var Utils = require('./utils/utils')

var CrossHair = React.createClass({
	propTypes: {
		yAxisPad: React.PropTypes.number.isRequired
	},
	contextTypes: {
		_height: React.PropTypes.number.isRequired,
		_width: React.PropTypes.number.isRequired,
		_mouseXY: React.PropTypes.array.isRequired,
		_xDisplayValue: React.PropTypes.string.isRequired,
		_yDisplayValue: React.PropTypes.string.isRequired
	},
	shouldComponentUpdate(nextProps, nextState, nextContext) {
		return nextContext._mouseXY !== this.context._mouseXY
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.CrossHair",
			yAxisPad: 5
		}
	},
	render() {
		return (
			<g className={'crosshair '}>
				<EdgeCoordinate
					type="horizontal"
					className="horizontal"
					show={true}
					x1={0} y1={this.context._mouseXY[1]}
					x2={this.context._width + this.props.yAxisPad} y2={this.context._mouseXY[1]}
					coordinate={this.context._yDisplayValue}
					edgeAt={this.context._width + this.props.yAxisPad}
					orient="right"
					/>
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

module.exports = CrossHair;
