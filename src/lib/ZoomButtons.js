import React, { Component } from "react";
import PropTypes from "prop-types";
// import { mean } from "d3-array";

import { interpolateNumber } from "d3-interpolate";

import { last } from "./utils";

class ZoomButtons extends Component {
	constructor(props) {
		super(props);
		this.handleZoomOut = this.handleZoomOut.bind(this);
		this.handleZoomIn = this.handleZoomIn.bind(this);
		this.zoom = this.zoom.bind(this);
	}
	zoom(direction) {
		const { xAxisZoom, xScale, plotData, xAccessor } = this.context;
		const cx = xScale(xAccessor(last(plotData)));
		// mean(xScale.range());
		const { zoomMultiplier } = this.props;

		const c = direction > 0 ? 1 * zoomMultiplier : 1 / zoomMultiplier;

		const [start, end] = xScale.domain();
		const [newStart, newEnd] = xScale.range()
			.map(x => cx + (x - cx) * c)
			.map(xScale.invert);

		const left = interpolateNumber(start, newStart);
		const right = interpolateNumber(end, newEnd);

		const foo = [0.25, 0.3, 0.5, 0.6, 0.75, 1].map(i => {
			return [left(i), right(i)];
		});

		this.interval = setInterval(() => {
			xAxisZoom(foo.shift());
			if (foo.length === 0) {
				clearInterval(this.interval);
			}
		}, 10);
	}
	handleZoomOut() {
		this.zoom(1);
	}
	handleZoomIn() {
		this.zoom(-1);
	}
	render() {
		const { chartConfig } = this.context;
		const { width, height } = chartConfig;
		const { size, heightFromBase, rx, ry } = this.props;
		const { stroke, fill, strokeWidth, fillOpacity } = this.props;
		const { fontSize, textDy, textFill } = this.props;
		const centerX = width / 2;
		const y = height - heightFromBase;

		return (
			<g className="react-stockcharts-zoom-button">
				<rect
					x={centerX - size - 1}
					y={y}
					rx={rx}
					ry={ry}
					height={size}
					width={size}
					fill={fill}
					fillOpacity={fillOpacity}
					stroke={stroke}
					strokeWidth={strokeWidth}
				/>
				<text
					x={centerX - size / 2 - 1}
					y={y + size / 2}
					dy={textDy}
					textAnchor="middle"
					fontSize={fontSize}
					fill={textFill}
				>-</text>
				<rect
					x={centerX + 1}
					y={y}
					rx={rx}
					ry={ry}
					height={size}
					width={size}
					fill={fill}
					fillOpacity={fillOpacity}
					stroke={stroke}
					strokeWidth={strokeWidth}
				/>
				<text
					x={centerX + size / 2 + 1}
					y={y + size / 2}
					dy={textDy}
					textAnchor="middle"
					fontSize={fontSize}
					fill={textFill}
				>+</text>
				<rect className="react-stockcharts-enable-interaction"
					onClick={this.handleZoomOut}
					x={centerX - size - 1}
					y={y}
					rx={rx}
					ry={ry}
					height={size}
					width={size}
					fill="none"
				/>
				<rect className="react-stockcharts-enable-interaction"
					onClick={this.handleZoomIn}
					x={centerX + 1}
					y={y}
					rx={rx}
					ry={ry}
					height={size}
					width={size}
					fill="none"
				/>
			</g>
		);
	}
}

ZoomButtons.propTypes = {
	zoomMultiplier: PropTypes.number.isRequired,
	size: PropTypes.number.isRequired,
	heightFromBase: PropTypes.number.isRequired,
	rx: PropTypes.number.isRequired,
	ry: PropTypes.number.isRequired,
	stroke: PropTypes.string.isRequired,
	strokeWidth: PropTypes.number.isRequired,
	fill: PropTypes.string.isRequired,
	fillOpacity: PropTypes.number.isRequired,
	fontSize: PropTypes.number.isRequired,
	textDy: PropTypes.string.isRequired,
	textFill: PropTypes.string.isRequired,
};

ZoomButtons.defaultProps = {
	size: 20,
	heightFromBase: 50,
	rx: 3,
	ry: 3,
	stroke: "#000000",
	strokeWidth: 1,
	fill: "#D6D6D6",
	fillOpacity: 1,
	fontSize: 16,
	textDy: ".3em",
	textFill: "#000000",
	zoomMultiplier: 1.5,
};

ZoomButtons.contextTypes = {
	xScale: PropTypes.func.isRequired,
	chartConfig: PropTypes.object.isRequired,
	plotData: PropTypes.array.isRequired,
	xAccessor: PropTypes.func.isRequired,
	xAxisZoom: PropTypes.func.isRequired,
};

export default ZoomButtons;