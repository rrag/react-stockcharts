'use strict';

var React = require('react');
var Utils = require('./utils/utils')
var ChartDataUtil = require('./utils/ChartDataUtil');

class CompareTooltip extends React.Component {
	render() {
		var displayValue = "n/a";

		var chartData = ChartDataUtil.getChartDataForChart(this.props, this.context);
		var item = ChartDataUtil.getCurrentItemForChart(this.props, this.context);

		var thisSeries = chartData.config.compareSeries.filter(each => each.id === this.props.forCompareSeries)[0];

		if (item !== undefined && thisSeries.yAccessor(item) !== undefined) {
			displayValue = thisSeries.yAccessor(item);
		}
		return (
			<g transform={"translate(" + this.props.origin[0] + ", " + this.props.origin[1] + ")"}>
				<text x={0} y={0} className="legend">
					<tspan key="label" x={0} dy="5" className="tooltip-label">{thisSeries.displayLabel + ': '}</tspan>
					<tspan key="value" stroke={thisSeries.stroke} >{displayValue}</tspan>
				</text>
			</g>
		);
	}
};

CompareTooltip.contextTypes = {
	chartData: React.PropTypes.array.isRequired,
	currentItems: React.PropTypes.array.isRequired,
}
CompareTooltip.propTypes = {
	forChart: React.PropTypes.number.isRequired,
	forCompareSeries: React.PropTypes.number.isRequired,
	xDisplayFormat: React.PropTypes.func.isRequired,
	origin: React.PropTypes.array.isRequired,
}

CompareTooltip.defaultProps = { 
	namespace: "ReStock.CompareTooltip",
	xDisplayFormat: Utils.displayDateFormat,
	origin: [0, 0]
};

module.exports = CompareTooltip;
