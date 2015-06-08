'use strict';
var React = require('react');
var Utils = require('./utils/utils')
var EdgeCoordinate = require('./EdgeCoordinate')
var ChartDataUtil = require('./utils/ChartDataUtil');

class EdgeIndicator extends React.Component {
	render() {
		var chartData = ChartDataUtil.getChartDataForChart(this.props, this.context);
		var currentItem = ChartDataUtil.getCurrentItemForChart(this.props, this.context);
		var edge = null, item, yAccessor;
		if (this.props.forOverlay !== undefined
				&& chartData.config.overlays.length > 0
				&& chartData.plot.overlayValues.length > 0) {

			var overlay = chartData.config.overlays
				.filter((eachOverlay) => eachOverlay.id === this.props.forOverlay);
			var overlayValue = chartData.plot.overlayValues
				.filter((eachOverlayValue) => eachOverlayValue.id === this.props.forOverlay);

			// console.log(overlay, overlayValue);
			if (overlay.length !== 1) {
				console.warn('%s overlays found with id %s, correct the OverlaySeries so there is exactly one for each id', overlay.length, newChild.props.forOverlay)
				throw new Error('Unable to identify unique Overlay for the id');
			}
			if (overlayValue.length !== 1 && overlay.length === 1) {
				console.warn('Something is wrong!!!, There should be 1 overlayValue, report the issue on github');
			}

			item = this.props.itemType === 'first'
				? overlayValue[0].first
				: this.props.itemType === 'last'
					? overlayValue[0].last
					: currentItem;
			yAccessor = overlay[0].yAccessor;

			if (item !== undefined) {
				var yValue = yAccessor(item), xValue = chartData.config.accessors.xAccessor(item);
				var x1 = Math.round(chartData.plot.scales.xScale(xValue)), y1 = Math.round(chartData.plot.scales.yScale(yValue));
				var edgeX = this.props.edgeAt === 'left'
					? 0 - this.props.yAxisPad
					: this.context.width + this.props.yAxisPad

				edge = <EdgeCoordinate
						type={this.props.type}
						className="edge-coordinate"
						fill={overlay[0].stroke}
						show={true}
						x1={x1 + chartData.config.origin[0]} y1={y1 + chartData.config.origin[1]}
						x2={edgeX + chartData.config.origin[0]} y2={y1 + chartData.config.origin[1]}
						coordinate={this.props.displayFormat(yValue)}
						edgeAt={edgeX}
						orient={this.props.orient}
						/>
			}
		} else if (this.props.forOverlay === undefined) {
			item = this.props.itemType === 'first'
				? chartData.firstItem
				: this.props.itemType === 'last'
					? chartData.lastItem
					: currentItem;
			yAccessor = chartData.config.accessors.yAccessor;

			if (item !== undefined && yAccessor !== null) {
				var yValue = yAccessor(item);
				var xValue = chartData.accessors.xAccessor(item);

				var x1 = Math.round(chartData.plot.scales.xScale(xValue)), y1 = Math.round(chartData.plot.scales.yScale(yValue));
				var edgeX = this.props.edgeAt === 'left'
					? 0 - this.props.yAxisPad
					: this.context.width + this.props.yAxisPad

				edge = <EdgeCoordinate
						type={this.props.type}
						className="edge-coordinate"
						show={true}
						x1={x1 + chartData.config.origin[0]} y1={y1 + chartData.config.origin[1]}
						x2={edgeX + chartData.config.origin[0]} y2={y1 + chartData.config.origin[1]}
						coordinate={this.props.displayFormat(yValue)}
						edgeAt={edgeX}
						orient={this.props.orient}
						/>
			}
		}
		return edge;
	}
};

EdgeIndicator.contextTypes = {
	width: React.PropTypes.number.isRequired,
	chartData: React.PropTypes.array.isRequired,
	currentItems: React.PropTypes.array.isRequired,
}
EdgeIndicator.propTypes = {
	type: React.PropTypes.oneOf(['horizontal']).isRequired,
	className: React.PropTypes.string,
	itemType: React.PropTypes.oneOf(['first', 'last', 'current']).isRequired,
	orient: React.PropTypes.oneOf(['left', 'right']),
	edgeAt: React.PropTypes.oneOf(['left', 'right']),

	forChart: React.PropTypes.number.isRequired,
	forOverlay: React.PropTypes.number, // undefined means main Data series of that chart

	displayFormat: React.PropTypes.func.isRequired,
}

EdgeIndicator.defaultProps = { 
	type: 'horizontal',
	orient: 'left',
	edgeAt: 'left',
	displayFormat: Utils.displayNumberFormat,
	yAxisPad: 5,
	namespace: "ReStock.EdgeIndicator"
};

module.exports = EdgeIndicator;
