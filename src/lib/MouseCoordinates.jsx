'use strict';
var React = require('react');
var EdgeCoordinate = require('./EdgeCoordinate')
var Utils = require('./utils/utils')

// Should not use xScale and yScale here as MouseCoordinate is common across all charts
// if it is made to be inside a Chart another Chart might be displayed over it
var MouseCoordinates = React.createClass({
	propTypes: {
		/* _height: React.PropTypes.number.isRequired,
		_width: React.PropTypes.number.isRequired,
		_show: React.PropTypes.bool.isRequired,
		_mouseXY: React.PropTypes.array.isRequired,
		_chartData: React.PropTypes.object.isRequired,
		_currentItem: React.PropTypes.object.isRequired, */

		forChart: React.PropTypes.number.isRequired, 
		xDisplayFormat: React.PropTypes.func.isRequired,
		yDisplayFormat: React.PropTypes.func.isRequired
	},
	shouldComponentUpdate(nextProps, nextState, nextContext) {
		return nextContext._currentItems != this.context._currentItems
				|| nextProps._mouseXY !== this.props._mouseXY
				|| nextProps._show !== this.props._show
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
	},
	renderChildren() {
		var chartData = this.getChartData();
		var item = this.getCurrentItem();

		console.log(item);
		var xValue = chartData.accessors.xAccessor(item);
		var xDisplayValue = this.props._dateAccessor === undefined
			? xValue
			: this.props._dateAccessor(item);

		var yValue = chartData.scales.yScale.invert(this.props._mouseXY[1]);

		if (xValue === undefined || yValue === undefined) return null;
		var x = this.props.snapX ? Math.round(chartData.scales.xScale(xValue)) : this.props._mouseXY[0];
		var y = this.props._mouseXY[1];

		//console.log(xValue, this.props.xDisplayFormat(xValue));
		//console.log(yValue, this.props.yDisplayFormat(yValue));

		return React.Children.map(this.props.children, (child) => {
			if (typeof child.type === 'string') return child;
			var newChild = child;
			return React.cloneElement(newChild, {
				_width: this.context._width
				, _height: this.context._height
				, _mouseXY: [x, y]
				, _xDisplayValue: this.props.xDisplayFormat(xDisplayValue)
				, _yDisplayValue: this.props.yDisplayFormat(yValue)
			});
		}, this);
	},
	render() {
		var children = null;
		if (this.context._show) {
			children = this.renderChildren();
		};

		return (
			<g className={this.context._show ? 'show' : 'hide'}>
				{children}
			</g>
		);
	}
});

module.exports = MouseCoordinates;


/*



*/