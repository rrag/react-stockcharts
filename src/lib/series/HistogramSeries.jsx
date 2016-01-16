"use strict";

import React from "react";

import wrap from "./wrap";

import identity from "../indicator/calculator/identity";
import { hexToRGBA } from "../utils/utils";

class HistogramSeries extends React.Component {
	render() {
		var { props } = this;
		return <g className="histogram">
			{HistogramSeries.getBarsSVG(props)}
		</g>;
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

HistogramSeries.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {
	var { xAccessor, yAccessor, stroke } = props;

	var bars = HistogramSeries.getBars(props, xAccessor, yAccessor, xScale, yScale, plotData);

	var nest = d3.nest()
		.key(d => d.fill)
		.entries(bars);

	nest.forEach(outer => {
		var { key, values } = outer;
		if (values[0].barWidth < 1) {
			ctx.strokeStyle = key;
		} else {
			ctx.strokeStyle = key;
			ctx.fillStyle = hexToRGBA(key, props.opacity);
		}
		values.forEach(d => {
			if (d.barWidth < 1) {
				/* <line key={idx} className={d.className}
							stroke={stroke}
							fill={fill}
							x1={d.x} y1={d.y}
							x2={d.x} y2={d.y + d.height} />*/
				ctx.beginPath();
				ctx.moveTo(d.x, d.y);
				ctx.lineTo(d.x, d.y + d.height);
				ctx.stroke();
			} else {
				/* <rect key={idx} className={d.className}
						stroke={stroke}
						fill={fill}
						x={d.x}
						y={d.y}
						width={d.barWidth}
						height={d.height} /> */
				ctx.beginPath();
				ctx.rect(d.x, d.y, d.barWidth, d.height);
				ctx.fill();
				if (stroke) ctx.stroke();
			}

		})
	})
};

HistogramSeries.getBarsSVG = (props) => {

	/* eslint-disable react/prop-types */
	var { xAccessor, yAccessor, xScale, yScale, plotData } = props;
	/* eslint-disable react/prop-types */

	var bars = HistogramSeries.getBars(props, xAccessor, yAccessor, xScale, yScale, plotData);

	return bars.map((d, idx) => {
		if (d.barWidth <= 1) {
			return <line key={idx} className={d.className}
						stroke={d.fill}
						x1={d.x} y1={d.y}
						x2={d.x} y2={d.y + d.height} />;
		}
		return <rect key={idx} className={d.className}
					stroke={d.stroke}
					fill={d.fill}
					x={d.x}
					y={d.y}
					width={d.barWidth}
					fillOpacity={props.opacity}
					height={d.height} />;
	});
};

HistogramSeries.getBars = (props, xAccessor, yAccessor, xScale, yScale, plotData) => {
	var { baseAt, direction, className, fill, stroke, widthRatio, yAccessorNarrow } = props;
	var base = baseAt === "top"
				? 0
				: baseAt === "bottom"
					? yScale.range()[0]
					: baseAt === "middle"
						? (yScale.range()[0] + yScale.range()[1]) / 2
						: baseAt;

	var dir = direction === "up" ? -1 : 1;

	var getClassName = () => className;
	if (typeof className === "function") {
		getClassName = className;
	}

	var getFill = () => fill;
	if (typeof fill === "function") {
		getFill = fill;
	}

	var width = xScale(xAccessor(plotData[plotData.length - 1]))
		- xScale(xAccessor(plotData[0]));
	var barWidth = Math.round(width / (plotData.length - 1) * widthRatio);

	var bars = plotData
			.filter((d) => (yAccessorNarrow(yAccessor(d)) !== undefined) )
			.map((d) => {
				var yValue = yAccessorNarrow(yAccessor(d));
				var x = Math.round(xScale(xAccessor(d)))
						- (barWidth === 1 ? 0 : 0.5 * barWidth),
				// var x = (xScale(xAccessor(d))) - 0.5 * barWidth,
					className = getClassName(d), y, height;

				var newBase = base;
				if (typeof base === "function") {
					newBase = base(xScale, yScale, d);
				}

				if (dir > 0) {
					y = newBase;
					height = yScale.range()[0] - yScale(yValue);
				} else {
					y = yScale(yValue);
					height = newBase - y;
				}

				if (height < 0) {
					y = newBase;
					height = -height;
				}
				return {
					barWidth: (barWidth),
					height: (height),
					x: (x),
					y: (y),
					className: className,
					stroke: stroke ? getFill(d) : "none",
					fill: getFill(d),
				};
			});
	return bars;
};

export default wrap(HistogramSeries);
