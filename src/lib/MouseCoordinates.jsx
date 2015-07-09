"use strict";

import React from "react";
import Utils from "./utils/utils";
import PureComponent from "./utils/PureComponent";
import CrossHair from "./CrossHair";

class MouseCoordinates extends PureComponent {
	constructor(props, context) {
		super(props, context);
		this.getPointer = this.getPointer.bind(this);
	}
	getPointer() {
		var {currentCharts, chartData, currentItems} = this.context;

		var edges = chartData
			.filter((eachChartData) => currentCharts.indexOf(eachChartData.id) > -1)
			.map((each) => {
				var yDisplayFormat = each.config.compareSeries.length > 0
					? (d) => (Math.round(d * 10000) / 100).toFixed(2) + "%"
					: each.config.mouseCoordinates.format;
				var mouseY = this.context.mouseXY[1] - each.config.origin[1];
				var yValue = each.plot.scales.yScale.invert(mouseY);
				return {
					id: each.id,
					at: each.config.mouseCoordinates.at,
					yValue: yValue,
					yDisplayFormat: yDisplayFormat
				};
			})
			.filter((each) => each.at !== undefined)
			.filter((each) => each.yDisplayFormat !== undefined)
			.map(each => {
				each.yDisplayValue = each.yDisplayFormat(each.yValue);
				return each;
			});

		// console.log(edges);
		var singleChartData = chartData.filter((eachChartData) => eachChartData.id === this.context.mainChart)[0];

		// var yDisplayFormat = singleChartData.config.compareSeries.length > 0 ? (d) => (Math.round(d * 10000) / 100).toFixed(2) + "%" : this.props.yDisplayFormat;

		var item = currentItems.filter((eachItem) => eachItem.id === this.context.mainChart)[0];// ChartDataUtil.getCurrentItemForChart(this.props, this.context);
		if (item === undefined) return null;
		item = item.data;
		// console.log(singleChartData, item);
		var xValue = singleChartData.config.accessors.xAccessor(item);

		var xDisplayValue = this.context.dataTransformOptions === undefined
			? xValue
			: this.context.dataTransformOptions.dateAccessor(item);

		// var yValue = singleChartData.plot.scales.yScale.invert(this.context.mouseXY[1]);

		if (xValue === undefined) return null;
		var x = this.props.snapX ? Math.round(singleChartData.plot.scales.xScale(xValue)) : this.context.mouseXY[0];
		var y = this.context.mouseXY[1];
		switch (this.props.type) {
			case "crosshair":
				return <CrossHair height={this.context.height} width={this.context.width} mouseXY={[x, y]}
					xDisplayValue={this.props.xDisplayFormat(xDisplayValue)} edges={edges}/>;
			case "vertical":
				return <VerticalMousePointer />;
		}
	}
	render() {
		var pointer = this.getPointer();

		return (
			<g className={this.context.show ? "show" : "hide"}>
				{pointer}
			</g>
		);
	}
}

MouseCoordinates.contextTypes = {
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
	mainChart: React.PropTypes.number.isRequired,
	show: React.PropTypes.bool,
	mouseXY: React.PropTypes.array,
	dataTransformOptions: React.PropTypes.object,
	chartData: React.PropTypes.array.isRequired,
	currentItems: React.PropTypes.array.isRequired,
	currentCharts: React.PropTypes.array.isRequired,
};

MouseCoordinates.propTypes = {
	xDisplayFormat: React.PropTypes.func.isRequired,
	yDisplayFormat: React.PropTypes.func.isRequired,
	type: React.PropTypes.oneOf(["crosshair", "vertical"]).isRequired
};

MouseCoordinates.defaultProps = {
	namespace: "ReStock.MouseCoordinates",
	show: false,
	snapX: true,
	xDisplayFormat: Utils.displayDateFormat,
	yDisplayFormat: Utils.displayNumberFormat,
};

module.exports = MouseCoordinates;
