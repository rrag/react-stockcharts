"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";

import wrap from "./wrap";
import { hexToRGBA } from "../utils";

class ScatterSeries extends Component {
	render() {
		var { className, markerProps, xScale, yScale, plotData } = this.props;
		var points = ScatterSeries.helper(this.props, xScale, yScale, plotData);

		return <g className={className}>
			{points.map((point, idx) => {
				var { marker: Marker } = point;
				return <Marker key={idx} {...markerProps} point={point} />;
			})}
		</g>;
	}
}

ScatterSeries.propTypes = {
	className: PropTypes.string,
	xAccessor: PropTypes.func,
	yAccessor: PropTypes.func.isRequired,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	plotData: PropTypes.array,
	marker: PropTypes.func,
	markerProvider: PropTypes.func,
	markerProps: PropTypes.object,
};

ScatterSeries.defaultProps = {
	className: "react-stockcharts-scatter",
};

ScatterSeries.yAccessor = d => d.close;

ScatterSeries.helper = (props, xScale, yScale, plotData) => {
	var { xAccessor, yAccessor, marker: Marker, markerProvider, markerProps } = props;

	if (!(markerProvider || Marker)) throw new Error("required prop, either marker or markerProvider missing");

	return plotData.map(d => {

		if (markerProvider) Marker = markerProvider(d);

		var mProps = { ...Marker.defaultProps, ...markerProps };

		var fill = d3.functor(mProps.fill);
		var stroke = d3.functor(mProps.stroke);

		return {
			x: xScale(xAccessor(d)),
			y: yScale(yAccessor(d)),
			fill: hexToRGBA(fill(d), mProps.opacity),
			stroke: stroke(d),
			datum: d,
			marker: Marker,
		};
	});
};

ScatterSeries.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {

	var { markerProps } = props;

	var points = ScatterSeries.helper(props, xScale, yScale, plotData);

	var nest = d3.nest()
		.key(d => d.fill)
		.key(d => d.stroke)
		.entries(points);

	nest.forEach(fillGroup => {
		var { key: fillKey, values: fillValues } = fillGroup;

		if (fillKey !== "none") {
			ctx.fillStyle = fillKey;
		}

		fillValues.forEach(strokeGroup => {
			var { key: strokeKey, values: strokeValues } = strokeGroup;

			ctx.strokeStyle = strokeKey;

			strokeValues.forEach(point => {
				var { marker } = point;
				marker.drawOnCanvasWithNoStateChange({ ...marker.defaultProps, ...markerProps }, point, ctx);
			});
		});
	});
};

export default wrap(ScatterSeries);
