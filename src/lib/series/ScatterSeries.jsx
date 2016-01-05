"use strict";

import React from "react";

import wrap from "./wrap";
import { hexToRGBA } from "../utils/utils";

class ScatterSeries extends React.Component {
	render() {
		var { className, fill, stroke, marker: Marker, markerProps, xScale, yScale, plotData } = this.props;

		var points = ScatterSeries.helper(this.props, xScale, yScale, plotData);

		return <g className={className}>
			{points.map((point, idx) => <Marker key={idx} {...markerProps} point={point} />)}
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
	var { xAccessor, yAccessor, compareSeries } = props;

	var isCompareSeries = compareSeries.length > 0;

	return plotData.map(d => ({ x: xAccessor(d), y: isCompareSeries ? yAccessor(d.compare) : yAccessor(d) }))
		.map(xy => ({ x: xScale(xy.x), y: yScale(xy.y) }));
};

ScatterSeries.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {

	var { stroke, fill, opacity, marker, markerProps } = props;

	var points = ScatterSeries.helper(props, xScale, yScale, plotData);

	points.forEach(point => {
		marker.drawOnCanvas({ ...marker.defaultProps, ...markerProps }, point, ctx)
	});
};

export default wrap(ScatterSeries);
