'use strict';
var React = require('react/addons');
var EdgeCoordinate = require('./edge-coordinate')
var Utils = require('../utils/utils')

var MouseCoordinates = React.createClass({
	propTypes: {
		_height: React.PropTypes.number.isRequired,
		_width: React.PropTypes.number.isRequired,
		_show: React.PropTypes.bool.isRequired,
		_mouseXY: React.PropTypes.object.isRequired,
		_snapMouseX: React.PropTypes.number.isRequired,
		_currentValue: React.PropTypes.object.isRequired,
		xDisplayFormat: React.PropTypes.func.isRequired,
		yDisplayFormat: React.PropTypes.func.isRequired,
		yAxisPad: React.PropTypes.number.isRequired
	},
	shouldComponentUpdate(nextProps, nextState) {
		return (nextProps.snapX
			? nextProps._snapMouseX !== this.props._snapMouseX || nextProps._mouseXY[1] !== this.props._mouseXY[1]
			: nextProps._mouseXY !== this.props._mouseXY) || nextProps._show !== this.props._show;
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.MouseCoordinates",
			_show: false,
			snapX: true,
			xDisplayFormat: Utils.displayDateFormat,
			yDisplayFormat: Utils.displayNumberFormat,
			yAxisPad: 10
		}
	},
	render() {
		if (!this.props._show || this.props._currentValue[0] === undefined) return null;
		var display = this.props._currentValue;
		var x = this.props.snapX ? this.props._snapMouseX : this.props._mouseXY[0];
		var y = this.props._mouseXY[1];

		/*console.log('for mouse xy = [', this.props._snapMouseX
			, ', ', this.props._mouseXY[1], ']'
			, ' showing values [', this.props.xDisplayFormat(display[0]), ', ', this.props.yDisplayFormat(display[1]), ']');*/
		return (
			<g className={this.props._show ? 'show' : 'hide'}>
				<EdgeCoordinate
					type="horizontal"
					className="horizontal"
					show={true}
					x1={0} y1={y}
					x2={this.props._width + this.props.yAxisPad} y2={y}
					coordinate={this.props.yDisplayFormat(display[1])}
					edgeAt={this.props._width + this.props.yAxisPad}
					orient="right"
					/>
				<EdgeCoordinate
					type="vertical"
					className="horizontal"
					show={true}
					x1={x} y1={0}
					x2={x} y2={this.props._height}
					coordinate={this.props.xDisplayFormat(display[0])}
					edgeAt={this.props._height}
					orient="bottom"
					/>
			</g>
		);
	}
});

module.exports = MouseCoordinates;


/*



*/