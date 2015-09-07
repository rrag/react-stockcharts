"use strict";

import React from "react";
import d3 from "d3";

import Utils from "../utils/utils";
import EdgeCoordinate from "./EdgeCoordinate";
import ChartDataUtil from "../utils/ChartDataUtil";

class EdgeIndicator extends React.Component {
	render() {
		var chartData = ChartDataUtil.getChartDataForChart(this.props, this.context);
		var currentItem = ChartDataUtil.getCurrentItemForChart(this.props, this.context);
		var edge = null, item, yAccessor;
		// console.log(chartData.config.compareSeries.length);
		var displayFormat = chartData.config.compareSeries.length > 0 ? d3.format(".0%") : this.props.displayFormat;

		if (this.props.forDataSeries !== undefined
				&& chartData.config.overlays.length > 0
				&& chartData.plot.overlayValues.length > 0) {

			var overlay = chartData.config.overlays
				.filter((eachOverlay) => eachOverlay.id === this.props.forDataSeries);
			var overlayValue = chartData.plot.overlayValues
				.filter((eachOverlayValue) => eachOverlayValue.id === this.props.forDataSeries);

			item = this.props.itemType === "first"
				? overlayValue[0].first
				: this.props.itemType === "last"
					? overlayValue[0].last
					: currentItem;
			yAccessor = overlay[0].yAccessor;

			if (item !== undefined) {
				let yValue = yAccessor(item), xValue = chartData.config.xAccessor(item);
				let x1 = Math.round(chartData.plot.scales.xScale(xValue)), y1 = Math.round(chartData.plot.scales.yScale(yValue));

				let stroke = overlay[0].stroke;
				let edgeX = this.props.edgeAt === "left"
					? 0 - this.props.yAxisPad
					: this.context.width + this.props.yAxisPad;
				edge = <EdgeCoordinate
						type={this.props.type}
						className="react-stockcharts-edge-coordinate"
						fill={stroke}
						show={true}
						x1={x1 + chartData.config.origin[0]} y1={y1 + chartData.config.origin[1]}
						x2={edgeX + chartData.config.origin[0]} y2={y1 + chartData.config.origin[1]}
						coordinate={displayFormat(yValue)}
						edgeAt={edgeX}
						orient={this.props.orient} />;
			}
		}
		return edge;
	}
}

EdgeIndicator.contextTypes = {
	width: React.PropTypes.number.isRequired,
	chartData: React.PropTypes.array.isRequired,
	currentItems: React.PropTypes.array.isRequired,
};

EdgeIndicator.propTypes = {
	type: React.PropTypes.oneOf(["horizontal"]).isRequired,
	className: React.PropTypes.string,
	itemType: React.PropTypes.oneOf(["first", "last", "current"]).isRequired,
	orient: React.PropTypes.oneOf(["left", "right"]),
	edgeAt: React.PropTypes.oneOf(["left", "right"]),
	forChart: React.PropTypes.number.isRequired,
	forDataSeries: React.PropTypes.number.isRequired,
	displayFormat: React.PropTypes.func.isRequired,
};

EdgeIndicator.defaultProps = {
	type: "horizontal",
	orient: "left",
	edgeAt: "left",
	displayFormat: Utils.displayNumberFormat,
	yAxisPad: 5,
	namespace: "ReStock.EdgeIndicator"
};

module.exports = EdgeIndicator;
