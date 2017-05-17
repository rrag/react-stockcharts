"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { nest as d3Nest } from "d3-collection";

import GenericChartComponent, { getAxisCanvas } from "../GenericChartComponent";
import { hexToRGBA, functor } from "../utils";

class ScatterSeries extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		var { xAccessor } = moreProps;

		var points = helper(this.props, moreProps, xAccessor);

		drawOnCanvas(ctx, this.props, points);
	}
	renderSVG(moreProps) {
		var { className, markerProps } = this.props;
		var { xAccessor } = moreProps;

		var points = helper(this.props, moreProps, xAccessor);

		return <g className={className}>
			{points.map((point, idx) => {
				var { marker: Marker } = point;
				return <Marker key={idx} {...markerProps} point={point} />;
			})}
		</g>;
	}
	render() {
		return <GenericChartComponent
			canvasToDraw={getAxisCanvas}
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			drawOnPan
			/>;
	}
}

ScatterSeries.propTypes = {
	className: PropTypes.string,
	yAccessor: PropTypes.func.isRequired,
	marker: PropTypes.func,
	markerProvider: PropTypes.func,
	markerProps: PropTypes.object,
};

ScatterSeries.defaultProps = {
	className: "react-stockcharts-scatter",
};

function helper(props, moreProps, xAccessor) {
	var { yAccessor, marker: Marker, markerProvider, markerProps } = props;
	var { xScale, chartConfig: { yScale }, plotData } = moreProps;

	if (!(markerProvider || Marker)) throw new Error("required prop, either marker or markerProvider missing");

	return plotData.map(d => {

		if (markerProvider) Marker = markerProvider(d);

		var mProps = { ...Marker.defaultProps, ...markerProps };

		var fill = functor(mProps.fill);
		var stroke = functor(mProps.stroke);

		return {
			x: xScale(xAccessor(d)),
			y: yScale(yAccessor(d)),
			fill: hexToRGBA(fill(d), mProps.opacity),
			stroke: stroke(d),
			datum: d,
			marker: Marker,
		};
	});
}

function drawOnCanvas(ctx, props, points) {

	var { markerProps } = props;

	var nest = d3Nest()
		.key(d => d.fill)
		.key(d => d.stroke)
		.entries(points);

	nest.forEach(fillGroup => {
		var { key: fillKey, values: fillValues } = fillGroup;

		if (fillKey !== "none") {
			ctx.fillStyle = fillKey;
		}

		fillValues.forEach(strokeGroup => {
			// var { key: strokeKey, values: strokeValues } = strokeGroup;
			var { values: strokeValues } = strokeGroup;

			strokeValues.forEach(point => {
				var { marker } = point;
				marker.drawOnCanvas({ ...marker.defaultProps, ...markerProps, fill: fillKey }, point, ctx);
			});
		});
	});
}

export default ScatterSeries;
