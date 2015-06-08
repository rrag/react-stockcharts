'use strict';
var React = require('react');
var CrossHair = require('./CrossHair')
var VerticalMousePointer = require('./VerticalMousePointer')
var Utils = require('./utils/utils')
var ChartDataUtil = require('./utils/ChartDataUtil');
var PureComponent = require('lib/utils/PureComponent');

class MouseCoordinates extends PureComponent {
	constructor(props, context) {
		super(props, context);
		this.getPointer = this.getPointer.bind(this);
	}
	getPointer(context) {
		var chartData = ChartDataUtil.getChartDataForChart(this.props, this.context);
		var item = ChartDataUtil.getCurrentItemForChart(this.props, this.context);

		var xValue = chartData.config.accessors.xAccessor(item);

		var xDisplayValue = context.dataTransformOptions === undefined
			? xValue
			: context.dataTransformOptions.dateAccessor(item);

		var yValue = chartData.plot.scales.yScale.invert(context.mouseXY[1]);

		if (xValue === undefined || yValue === undefined) return null;
		var x = this.props.snapX ? Math.round(chartData.plot.scales.xScale(xValue)) : context.mouseXY[0];
		var y = context.mouseXY[1];
		switch (this.props.type) {
			case 'crosshair':
				return <CrossHair height={context.height} width={context.width} mouseXY={[x, y]}
					xDisplayValue={this.props.xDisplayFormat(xDisplayValue)} yDisplayValue={this.props.yDisplayFormat(yValue)}/>
			case 'vertical':
				return <VerticalMousePointer />
		}
	}
	render() {
		var pointer = this.getPointer(this.context)

		return (
			<g className={this.context.show ? 'show' : 'hide'}>
				{pointer}
			</g>
		);
	}
};

MouseCoordinates.contextTypes = {
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
	show: React.PropTypes.bool,
	mouseXY: React.PropTypes.array,
	dataTransformOptions: React.PropTypes.object,
	chartData: React.PropTypes.array.isRequired,
	currentItems: React.PropTypes.array.isRequired,
}
MouseCoordinates.propTypes = {
	forChart: React.PropTypes.number.isRequired, 
	xDisplayFormat: React.PropTypes.func.isRequired,
	yDisplayFormat: React.PropTypes.func.isRequired,
	type: React.PropTypes.oneOf(['crosshair', 'vertical']).isRequired

}

MouseCoordinates.defaultProps = { 
	namespace: "ReStock.MouseCoordinates",
	show: false,
	snapX: true,
	xDisplayFormat: Utils.displayDateFormat,
	yDisplayFormat: Utils.displayNumberFormat,
};


module.exports = MouseCoordinates;