"use strict";

import React from "react";

import StackedHistogramSeries from "./StackedHistogramSeries";
import wrap from "./wrap";

import identity from "../indicator/calculator/identity";
import { hexToRGBA } from "../utils/utils";

class HistogramSeries extends React.Component {
	render() {
		var { yAccessor, yAccessorNarrow } = this.props;
		return <StackedHistogramSeries {...this.props} yAccessor={[yAccessor]} yAccessorNarrow={[yAccessorNarrow]}/>;
	}
}

HistogramSeries.propTypes = {
	baseAt: React.PropTypes.oneOfType([
		React.PropTypes.oneOf(["top", "bottom", "middle"]),
		React.PropTypes.number,
		React.PropTypes.func,
	]).isRequired,
	direction: React.PropTypes.oneOf(["up", "down"]).isRequired,
	stroke: React.PropTypes.bool.isRequired,
	widthRatio: React.PropTypes.number.isRequired,
	opacity: React.PropTypes.number.isRequired,
	fill: React.PropTypes.oneOfType([
		React.PropTypes.func, React.PropTypes.string
	]).isRequired,
	className: React.PropTypes.oneOfType([
		React.PropTypes.func, React.PropTypes.string
	]).isRequired,
	xAccessor: React.PropTypes.func,
	yAccessor: React.PropTypes.func,
	yAccessorNarrow: React.PropTypes.func,
	xScale: React.PropTypes.func,
	yScale: React.PropTypes.func,
	plotData: React.PropTypes.array,
};

HistogramSeries.defaultProps = {
	baseAt: "bottom",
	direction: "up",
	className: "bar",
	stroke: false,
	fill: "#4682B4",
	opacity: 1,
	widthRatio: 0.5,
	yAccessorNarrow: identity,
};

export default wrap(HistogramSeries);
