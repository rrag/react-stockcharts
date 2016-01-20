"use strict";

import React from "react";
import d3 from "d3";

import wrap from "./wrap";
import { hexToRGBA } from "../utils/utils";

class ScatterSeries extends React.Component {
	render() {
		var { className, fill, stroke, marker, markerProps, xScale, yScale, plotData } = this.props;
		var m = d3.functor(marker);

		var points = ScatterSeries.helper(this.props, xScale, yScale, plotData);

		return <g className={className}>
			{points.map((point, idx) => {
				var Marker = m(point.datum);
				return <Marker key={idx} {...markerProps} point={point} />
			})}
		</g>;
	}
}

ScatterSeries.propTypes = {
	className: React.PropTypes.string,
	xAccessor: React.PropTypes.func,
	yAccessor: React.PropTypes.func,
	xScale: React.PropTypes.func,
	yScale: React.PropTypes.func,
	compareSeries: React.PropTypes.array,
	plotData: React.PropTypes.array,
	marker: React.PropTypes.func,
};

ScatterSeries.defaultProps = {
	className: "react-stockcharts-scatter",
};

ScatterSeries.yAccessor = d => d.close;

ScatterSeries.helper = (props, xScale, yScale, plotData) => {
	var { xAccessor, yAccessor, compareSeries, marker: Marker, markerProps } = props;

	var isCompareSeries = compareSeries.length > 0;
	var mProps = { ...Marker.defaultProps, markerProps };

	var fill = d3.functor(mProps.fill)
	var stroke = d3.functor(mProps.stroke)

	return plotData.map(d => ({
			x: xScale(xAccessor(d)),
			y: yScale(isCompareSeries ? yAccessor(d.compare) : yAccessor(d)),
			fill: hexToRGBA(fill(d), mProps.opacity),
			stroke: stroke(d),
			datum: d,
		}));
};

ScatterSeries.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {

	var { stroke, fill, opacity, marker, markerProps } = props;

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
				marker.drawOnCanvasWithNoStateChange({ ...marker.defaultProps, ...markerProps }, point, ctx)
			})
		})
	});
};

export default wrap(ScatterSeries);
