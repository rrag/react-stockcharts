import React, { Component } from "react";
import PropTypes from "prop-types";
// import { mean } from "d3-array";

import { path as d3Path } from "d3-path";
import { interpolateNumber } from "d3-interpolate";

import { last, noop } from "./utils";

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
				delete this.interval;
			}
		}, 10);
	}
	handleZoomOut() {
		if (this.interval) return;
		this.zoom(1);
	}
	handleZoomIn() {
		if (this.interval) return;
		this.zoom(-1);
	}
	render() {
		const { chartConfig } = this.context;
		const { width, height } = chartConfig;
		const { size, heightFromBase, rx, ry } = this.props;
		const { stroke, strokeOpacity, fill, strokeWidth, fillOpacity } = this.props;
		const { textFill, textStrokeWidth } = this.props;
		const { onReset } = this.props;
		const centerX = Math.round(width / 2);
		const y = height - heightFromBase;

		const [w, h] = size;
		const hLength = 5;
		const wLength = 6;

		const textY = Math.round(y + h / 2);

		const resetX = centerX;

		const zoomOut = d3Path();
		const zoomOutX = centerX - w - 2 * strokeWidth;
		zoomOut.moveTo(zoomOutX - wLength, textY);
		zoomOut.lineTo(zoomOutX + wLength, textY);
		zoomOut.closePath();

		const zoomIn = d3Path();
		const zoomInX = centerX + w + 2 * strokeWidth;

		zoomIn.moveTo(zoomInX - wLength, textY);
		zoomIn.lineTo(zoomInX + wLength, textY);

		zoomIn.moveTo(zoomInX, textY - hLength);
		zoomIn.lineTo(zoomInX, textY + hLength);
		// zoomIn.closePath();

		return (
			<g className="react-stockcharts-zoom-button">
				<rect
					x={zoomOutX - w / 2}
					y={y}
					rx={rx}
					ry={ry}
					height={h}
					width={w}
					fill={fill}
					fillOpacity={fillOpacity}
					stroke={stroke}
					strokeOpacity={strokeOpacity}
					strokeWidth={strokeWidth}
				/>
				<path d={zoomOut.toString()}
					stroke={textFill}
					strokeWidth={textStrokeWidth}
				/>
				<rect
					x={resetX - w / 2}
					y={y}
					rx={rx}
					ry={ry}
					height={h}
					width={w}
					fill={fill}
					fillOpacity={fillOpacity}
					stroke={stroke}
					strokeOpacity={strokeOpacity}
					strokeWidth={strokeWidth}
				/>
				<g transform={`translate (${resetX}, ${y + h / 4}) scale(.14)`}>
					<path d="M31 13C23.4 5.3 12.8.5 1.1.5c-23.3 0-42.3 19-42.3 42.5s18.9 42.5 42.3 42.5c13.8 0 26-6.6 33.7-16.9l-16.5-1.8C13.5 70.4 7.5 72.5 1 72.5c-16.2 0-29.3-13.2-29.3-29.4S-15.2 13.7 1 13.7c8.1 0 15.4 3.3 20.7 8.6l-10.9 11h32.5V.5L31 13z"
						fill={textFill}
					/>
				</g>
				<rect
					x={zoomInX - w / 2}
					y={y}
					rx={rx}
					ry={ry}
					height={h}
					width={w}
					fill={fill}
					fillOpacity={fillOpacity}
					stroke={stroke}
					strokeOpacity={strokeOpacity}
					strokeWidth={strokeWidth}
				/>
				<path d={zoomIn.toString()}
					stroke={textFill}
					strokeWidth={textStrokeWidth}
				/>
				<rect className="react-stockcharts-enable-interaction out"
					onClick={this.handleZoomOut}
					x={zoomOutX - w / 2}
					y={y}
					rx={rx}
					ry={ry}
					height={h}
					width={w}
					fill="none"
				/>
				<rect className="react-stockcharts-enable-interaction reset"
					onClick={onReset}
					x={resetX - w / 2}
					y={y}
					rx={rx}
					ry={ry}
					height={h}
					width={w}
					fill="none"
				/>
				<rect className="react-stockcharts-enable-interaction in"
					onClick={this.handleZoomIn}
					x={zoomInX - w / 2}
					y={y}
					rx={rx}
					ry={ry}
					height={h}
					width={w}
					fill="none"
				/>
			</g>
		);
	}
}

ZoomButtons.propTypes = {
	zoomMultiplier: PropTypes.number.isRequired,
	size: PropTypes.array.isRequired,
	heightFromBase: PropTypes.number.isRequired,
	rx: PropTypes.number.isRequired,
	ry: PropTypes.number.isRequired,
	stroke: PropTypes.string.isRequired,
	strokeWidth: PropTypes.number.isRequired,
	strokeOpacity: PropTypes.number.isRequired,
	fill: PropTypes.string.isRequired,
	fillOpacity: PropTypes.number.isRequired,
	fontSize: PropTypes.number.isRequired,
	textDy: PropTypes.string.isRequired,
	textFill: PropTypes.string.isRequired,
	textStrokeWidth: PropTypes.number.isRequired,
	onReset: PropTypes.func,
};

ZoomButtons.defaultProps = {
	size: [30, 24],
	heightFromBase: 50,
	rx: 3,
	ry: 3,
	stroke: "#000000",
	strokeOpacity: 0.3,
	strokeWidth: 1,
	fill: "#D6D6D6",
	fillOpacity: 0.4,
	fontSize: 16,
	textDy: ".3em",
	textFill: "#000000",
	textStrokeWidth: 2,
	zoomMultiplier: 1.5,
	onReset: noop,
};

ZoomButtons.contextTypes = {
	xScale: PropTypes.func.isRequired,
	chartConfig: PropTypes.object.isRequired,
	plotData: PropTypes.array.isRequired,
	xAccessor: PropTypes.func.isRequired,
	xAxisZoom: PropTypes.func.isRequired,
};

export default ZoomButtons;
