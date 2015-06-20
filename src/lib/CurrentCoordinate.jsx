'use strict';
var React = require('react'),
	Utils = require('./utils/utils');

class CurrentCoordinate extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		var chartData = this.context.chartData.filter((each) => each.id === this.props.forChart)[0];
		var currentItem = this.context.currentItems.filter((each) => each.id === this.props.forChart)[0];
		var item = currentItem ? currentItem.data : undefined;
		var fill = 'black';

		if (! this.context.show || item === undefined) return null;
		var yAccessor =  this.props.yAccessor || chartData.config.accessors.yAccessor;

		if (this.props.forOverlay !== undefined) {
			var overlays = chartData.config.overlays
				.filter((each) => each.id === this.props.forOverlay);

			if (overlays.length != 1) {
				console.warn('Unique overlay with id={%s} not found', this.props.forOverlay);
				throw new Error('Unique overlay not found');
			}
			fill = overlays[0].stroke;
			yAccessor = overlays[0].yAccessor;
		} else if (this.props.forCompareSeries !== undefined) {
			var compSeries = chartData.config.compareSeries
				.filter((each) => each.id === this.props.forCompareSeries);

			if (compSeries.length != 1) {
				console.warn('Unique compareSeries with id={%s} not found', this.props.forCompareSeries);
				throw new Error('Unique compareSeries not found');
			}
			fill = compSeries[0].stroke;
			yAccessor = compSeries[0].percentYAccessor;
		}

		var xValue = chartData.config.accessors.xAccessor(item);
		var yValue = yAccessor(item);

		if (yValue === undefined) return null;

		var x = Math.round(chartData.plot.scales.xScale(xValue)) + chartData.config.origin[0];
		var y = Math.round(chartData.plot.scales.yScale(yValue)) + chartData.config.origin[1];

		return (
			<circle className={this.props.className} cx={x} cy={y} r={this.props.r} fill={fill} />
		);
	}
};

CurrentCoordinate.propTypes = {
	forChart: React.PropTypes.number.isRequired,
	forOverlay: React.PropTypes.number,
	forCompareSeries: React.PropTypes.number,
	yAccessor: React.PropTypes.func,
	r: React.PropTypes.number.isRequired,
	className: React.PropTypes.string,
}

CurrentCoordinate.defaultProps = { namespace: "ReStock.CurrentCoordinate", r: 3 };

CurrentCoordinate.contextTypes = {
	show: React.PropTypes.bool.isRequired,
	currentItems: React.PropTypes.array.isRequired,
	chartData: React.PropTypes.array.isRequired,
};

module.exports = CurrentCoordinate;
