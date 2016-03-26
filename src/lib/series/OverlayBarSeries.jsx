"use strict";

import d3 from "d3";
import React, { PropTypes, Component } from "react";

import wrap from "./wrap";

import { isDefined, isNotDefined, hexToRGBA, first, last } from "../utils";

class OverlayBarSeries extends Component {
	render() {
		var { props } = this;
		return <g className="react-stockcharts-bar-series">
			{OverlayBarSeries.getBarsSVG(props)}
		</g>;
	}
}

OverlayBarSeries.propTypes = {
	baseAt: PropTypes.oneOfType([
		PropTypes.oneOf(["top", "bottom", "middle"]),
		PropTypes.number,
		PropTypes.func,
	]).isRequired,
	direction: PropTypes.oneOf(["up", "down"]).isRequired,
	stroke: PropTypes.bool.isRequired,
	widthRatio: PropTypes.number.isRequired,
	opacity: PropTypes.number.isRequired,
	fill: PropTypes.oneOfType([
		PropTypes.func, PropTypes.string
	]).isRequired,
	className: PropTypes.oneOfType([
		PropTypes.func, PropTypes.string
	]).isRequired,
	xAccessor: PropTypes.func,
	yAccessor: PropTypes.arrayOf(PropTypes.func),
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	plotData: PropTypes.array,
};

OverlayBarSeries.defaultProps = {
	baseAt: "bottom",
	direction: "up",
	className: "bar",
	stroke: false,
	fill: "#4682B4",
	opacity: 1,
	widthRatio: 0.5,
};

OverlayBarSeries.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {
	var { xAccessor, yAccessor } = props;

	var bars = OverlayBarSeries.getBars(props, xAccessor, yAccessor, xScale, yScale, plotData)

	// console.log(bars);
	drawOnCanvas2(props, ctx, xScale, yScale, plotData, bars);
};

export function drawOnCanvas2(props, ctx, xScale, yScale, plotData, bars) {
	var { stroke } = props;

	var nest = d3.nest()
		.key(d => d.fill)
		.entries(bars);

	nest.forEach(outer => {
		var { key, values } = outer;
		if (values[0].width < 1) {
			ctx.strokeStyle = key;
		} else {
			ctx.strokeStyle = key;
			ctx.fillStyle = hexToRGBA(key, props.opacity);
		}
		values.forEach(d => {
			if (d.width < 1) {
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
						width={d.width}
						height={d.height} /> */
				ctx.beginPath();
				ctx.rect(d.x, d.y, d.width, d.height);
				ctx.fill();
				if (stroke) ctx.stroke();
			}

		});
	});
};

export function getBarsSVG2(props, bars) {
	/* eslint-disable react/prop-types */
	var { opacity } = props;
	/* eslint-disable react/prop-types */

	return bars.map((d, idx) => {
		if (d.width <= 1) {
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
					width={d.width}
					fillOpacity={opacity}
					height={d.height} />;
	});
}

OverlayBarSeries.getBarsSVG = (props) => {

	/* eslint-disable react/prop-types */
	var { xAccessor, yAccessor, xScale, yScale, plotData } = props;
	/* eslint-disable react/prop-types */

	var bars = OverlayBarSeries.getBars(props, xAccessor, yAccessor, xScale, yScale, plotData);
	return getBarsSVG2(props, bars);
};

OverlayBarSeries.getBars = (props, xAccessor, yAccessor, xScale, yScale, plotData) => {
	var { baseAt, className, fill, stroke, widthRatio } = props;
	var base = baseAt === "top"
				? 0
				: baseAt === "bottom"
					? first(yScale.range())
					: baseAt === "middle"
						? (first(yScale.range()) + last(yScale.range())) / 2
						: baseAt;

	var getClassName = d3.functor(className);
	var getFill = d3.functor(fill);
	var getBase = d3.functor(base);

	var width = Math.abs(xScale(xAccessor(last(plotData))) - xScale(xAccessor(first(plotData))));


	var bw = (width / (plotData.length - 1) * widthRatio);
	var barWidth = Math.round(bw);
	var offset = (barWidth === 1 ? 0 : 0.5 * barWidth);

	// console.log(xScale.domain(), yScale.domain());

	var bars = plotData
			.map(d => {
				var innerBars = yAccessor.map((eachYAccessor, i) => {
					var yValue = eachYAccessor(d);
					if (isNotDefined(yValue)) return undefined;

					var xValue = xAccessor(d);
					var x = Math.round(xScale(xValue)) - offset;
					var y = yScale(yValue);
					// console.log(yValue, y, xValue, x)
					return {
						width: barWidth,
						x: x,
						y: y,
						className: getClassName(d, i),
						stroke: stroke ? getFill(d, i) : "none",
						fill: getFill(d, i),
						i,
					};
				}).filter(yValue => isDefined(yValue));

				var b = getBase(xScale, yScale, d);
				var h;
				for (var i = innerBars.length - 1; i >= 0; i--) {
					h = b - innerBars[i].y;
					if (h < 0) {
						innerBars[i].y = b;
						h = -1 * h;
					}
					innerBars[i].height = h;
					b = innerBars[i].y;
				};
				return innerBars;
			});

	return d3.merge(bars);
};

// export { OverlayBarSeries };
export default wrap(OverlayBarSeries);
