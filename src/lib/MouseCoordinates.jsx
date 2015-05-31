'use strict';
var React = require('react');
var CrossHair = require('./CrossHair')
var VerticalMousePointer = require('./VerticalMousePointer')
var Utils = require('./utils/utils')


var MouseCoordinates = React.createClass({
	propTypes: {
		forChart: React.PropTypes.number.isRequired, 
		xDisplayFormat: React.PropTypes.func.isRequired,
		yDisplayFormat: React.PropTypes.func.isRequired,
		type: React.PropTypes.oneOf(['crosshair', 'vertical']).isRequired
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
	getPointer() {
		var chartData = this.getChartData();
		var item = this.getCurrentItem();

		var xValue = chartData.config.accessors.xAccessor(item);
		var xDisplayValue = this.context.dataTransformOptions === undefined
			? xValue
			: this.context.dataTransformOptions._dateAccessor(item);

		var yValue = chartData.plot.scales.yScale.invert(this.context._mouseXY[1]);

		if (xValue === undefined || yValue === undefined) return null;
		var x = this.props.snapX ? Math.round(chartData.plot.scales.xScale(xValue)) : this.context._mouseXY[0];
		var y = this.context._mouseXY[1];
		switch (this.props.type) {
			case 'crosshair':
				return <CrossHair height={this.context._height} width={this.context._width} mouseXY={[x, y]}
					xDisplayValue={this.props.xDisplayFormat(xDisplayValue)} yDisplayValue={this.props.yDisplayFormat(yValue)}/>
			case 'vertical':
				return <VerticalMousePointer />
		}
	},
	render() {

		var pointer = this.getPointer()
		/*if (this.context._show) {
			//children = this.props.children;
			children = ;
		};*/
		return (
			<g className={this.context._show ? 'show' : 'hide'}>
				{pointer}
			</g>
		);
	}
});

module.exports = MouseCoordinates;
