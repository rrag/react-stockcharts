'use strict';
var React = require('react'),
	Utils = require('./utils/utils');

var CurrentCoordinate = React.createClass({
	propTypes: {
		forChart: React.PropTypes.number.isRequired,
		forOverlay: React.PropTypes.number,
		yAccessor: React.PropTypes.func,
		r: React.PropTypes.number.isRequired,
		className: React.PropTypes.string,
	},
	contextTypes: {
		_show: React.PropTypes.bool.isRequired,
		_currentItems: React.PropTypes.array.isRequired,
		_chartData: React.PropTypes.array.isRequired,
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.CurrentCoordinate",
			r: 3
		};
	},
	render() {

		var chartData = this.context._chartData.filter((each) => each.id === this.props.forChart)[0];
		var currentItem = this.context._currentItems.filter((each) => each.id === this.props.forChart)[0];
		var item = currentItem ? currentItem.data : undefined;
		var fill = 'black';

		if (! this.context._show || item === undefined) return null;
		var yAccessor =  this.props.yAccessor || chartData.accessors.yAccessor;

		if (this.props.forOverlay !== undefined) {
			var overlays = chartData.overlays
				.filter((each) => each.id === this.props.forOverlay);

			if (overlays.length != 1) {
				console.warn('Unique overlay with id={%s} not found', this.props.forOverlay);
				throw new Error('Unique overlay not found');
			}
			fill = overlays[0].stroke;
			yAccessor = overlays[0].yAccessor;
		}

		var xValue = chartData.accessors.xAccessor(item);
		var yValue = yAccessor(item);

		if (yValue === undefined) return null;

		var x = Math.round(chartData.scales.xScale(xValue)) + chartData.origin[0];
		var y = Math.round(chartData.scales.yScale(yValue)) + chartData.origin[1];

		return (
			<circle className={this.props.className} cx={x} cy={y} r={this.props.r} fill={fill} />
		);
	}
});

module.exports = CurrentCoordinate;
