'use strict';
var React = require('react');
var EdgeCoordinate = require('./EdgeCoordinate')
var Utils = require('./utils/utils')

var MouseCoordinates = React.createClass({
	propTypes: {
		forChart: React.PropTypes.number.isRequired, 
		xDisplayFormat: React.PropTypes.func.isRequired,
		yDisplayFormat: React.PropTypes.func.isRequired
	},
	shouldComponentUpdate(nextProps, nextState, nextContext) {
		return nextContext._currentItems != this.context._currentItems
				|| nextContext._mouseXY !== this.context._mouseXY
				|| nextContext._show !== this.context._show
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.MouseCoordinates",
			_show: false,
			snapX: true,
			xDisplayFormat: Utils.displayDateFormat,
			yDisplayFormat: Utils.displayNumberFormat,
		}
	},
	mixins: [require('./mixin/ForChartMixin')],
	contextTypes: {
		_width: React.PropTypes.number.isRequired,
		_height: React.PropTypes.number.isRequired,
		_show: React.PropTypes.bool,
		_mouseXY: React.PropTypes.array,
		dataTransformOptions: React.PropTypes.object,
	},
	childContextTypes: {
		_mouseXY: React.PropTypes.array.isRequired,
		_xDisplayValue: React.PropTypes.string.isRequired,
		_yDisplayValue: React.PropTypes.string.isRequired,
	},
	getChildContext() {
		var chartData = this.getChartData();
		var item = this.getCurrentItem();

		var xValue = chartData.accessors.xAccessor(item);
		var xDisplayValue = this.context.dataTransformOptions === undefined
			? xValue
			: this.context.dataTransformOptions._dateAccessor(item);

		var yValue = chartData.scales.yScale.invert(this.context._mouseXY[1]);

		if (xValue === undefined || yValue === undefined) return null;
		var x = this.props.snapX ? Math.round(chartData.scales.xScale(xValue)) : this.context._mouseXY[0];
		var y = this.context._mouseXY[1];

		// console.log(xDisplayValue, yValue);
		return {
			_mouseXY: [x, y],
			_xDisplayValue: this.props.xDisplayFormat(xDisplayValue),
			_yDisplayValue: this.props.yDisplayFormat(yValue)
		}
	},
	render() {
		var children = null;
		if (this.context._show) {
			//children = this.props.children;
			children = React.Children.map(this.props.children, (child) => React.cloneElement(child));
		};
		console.log('MouseCoordinates.render', this.context._show);
		return (
			<g className={this.context._show ? 'show' : 'hide'}>
				{children}
			</g>
		);
	}
});

module.exports = MouseCoordinates;
