/* eslint-disable */
"use strict";

import d3 from "d3";
import React, { PropTypes, Component } from "react";

import wrap from "./wrap";

import { isDefined, isNotDefined, hexToRGBA, first, last } from "../utils";

class HorizontalStackedBarSeries extends Component {
	render() {
		var { props } = this;
		return <g className="react-stockcharts-horizontal-bar-series">
			{HorizontalStackedBarSeries.getBarsSVG(props)}
		</g>;
	}
}

HorizontalStackedBarSeries.propTypes = {
	baseAt: PropTypes.oneOfType([
		PropTypes.oneOf(["left", "right", "middle"]),
		PropTypes.number,
		PropTypes.func,
	]).isRequired,
	direction: PropTypes.oneOf(["up", "down"]).isRequired,
	stroke: PropTypes.bool.isRequired,
	heightRatio: PropTypes.number.isRequired,
	opacity: PropTypes.number.isRequired,
	fill: PropTypes.oneOfType([
		PropTypes.func, PropTypes.string
	]).isRequired,
	className: PropTypes.oneOfType([
		PropTypes.func, PropTypes.string
	]).isRequired,
	xAccessor: PropTypes.func,
	yAccessor: PropTypes.func,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	plotData: PropTypes.array,
};

HorizontalStackedBarSeries.defaultProps = {
	baseAt: "left",
	direction: "up",
	className: "bar",
	stroke: false,
	fill: "#4682B4",
	opacity: 1,
	heightRatio: 0.5,
};

HorizontalStackedBarSeries.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {
	var { xAccessor, yAccessor, stroke } = props;
	var bars = HorizontalStackedBarSeries.getBars(props, [xAccessor], yAccessor, xScale, yScale, plotData);
	// console.log(bars);
	drawOnCanvas2(props, ctx, xScale, yScale, plotData, bars);
};

HorizontalStackedBarSeries.getBarsSVG = (props) => {

	var { xAccessor, yAccessor, xScale, yScale, plotData } = props;

	var bars = HorizontalStackedBarSeries.getBars(props, xAccessor, yAccessor, xScale, yScale, plotData);
	return getBarsSVG2(props, bars);
};


export function drawOnCanvas2(props, ctx, xScale, yScale, plotData, bars) {
	var { stroke } = props;

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
				ctx.lineTo(d.x + d.width, d.y);
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
				ctx.rect(d.x, d.y, d.width, d.barHeight);
				ctx.fill();
				if (stroke) ctx.stroke();
			}

		});
	});
};

export function getBarsSVG2(props, bars) {
	/* eslint-disable react/prop-types */
	var { opacity } = props;
	/* eslint-enable react/prop-types */

	return bars.map((d, idx) => {
		if (d.barWidth <= 1) {
			return <line key={idx} className={d.className}
						stroke={d.fill}
						x1={d.x} y1={d.y}
						x2={d.x + d.width} y2={d.y} />;
		}
		return <rect key={idx} className={d.className}
					stroke={d.stroke}
					fill={d.fill}
					x={d.x}
					y={d.y}
					width={d.width}
					fillOpacity={opacity}
					height={d.barHeight} />;
	});
}

HorizontalStackedBarSeries.getBars = (props, xAccessor, yAccessor, xScale, yScale, plotData) => {

	var { baseAt, className, fill, stroke, heightRatio, height } = props;

	var base = baseAt === "left"
				? 0
				: baseAt === "right"
					? first(xScale.range())
					: baseAt === "middle"
						? (first(xScale.range()) + last(xScale.range())) / 2
						: baseAt;

	var getClassName = d3.functor(className);
	var getFill = d3.functor(fill);
	var getBase = d3.functor(base);

	var h = Math.abs(yScale(yAccessor(last(plotData)))
		- yScale(yAccessor(first(plotData))));

	var bh = (h / (plotData.length - 1) * heightRatio);
	var barHeight = Math.round(bh);
	var offset = (barHeight === 1 ? 0 : 0.5 * barHeight);

	var layers = xAccessor.map((eachXAccessor, i) => plotData
		.map(d => ({
			series: yAccessor(d),
			x: i,
			y: eachXAccessor(d),
			className: getClassName(d, i),
			stroke: stroke ? getFill(d, i) : "none",
			fill: getFill(d, i),
		})))


	var stack = d3.layout.stack();
	var data = stack(layers);

	console.log(data);
	var bars = d3.merge(data)
			.map((d, idx) => ({
				className: d.className,
				stroke: d.stroke,
				fill: d.fill,
				y: xScale(d.series) - barHeight / 2,
				x: yScale(d.y0 + d.y),
				width: getBase(xScale, yScale, d) - yScale(d.x),
				barHeight: barHeight,
			}));
	return bars;
};

/*

HorizontalStackedBarSeries.getBars = (props, xAccessor, yAccessor, xScale, yScale, plotData) => {
	var { baseAt, className, fill, stroke, heightRatio, height } = props;
	var base = baseAt === "left"
				? xScale.range()[0]
				: baseAt === "right"
					? xScale.range()[1]
					: baseAt === "middle"
						? (xScale.range()[0] + xScale.range()[1]) / 2
						: baseAt;

	// console.log(plotData.map(d => d.y), base, yAccessor);
	var getClassName = d3.functor(className);
	var getFill = d3.functor(fill);
	var getBase = d3.functor(base);

	var h = Math.abs(yScale(yAccessor(last(plotData)))
		- yScale(yAccessor(first(plotData))));

	var bh = (h / (plotData.length - 1) * heightRatio);
	var barHeight = Math.round(bh);
	var offset = (barHeight === 1 ? 0 : 0.5 * barHeight);


	var bars = plotData
			.map(d => {
				var innerBars = xAccessor.map((eachXAccessor, i) => {
					var xValue = eachXAccessor(d);
					if (isNotDefined(xValue)) return undefined;

					var y = Math.round(yScale(yAccessor(d))) - offset;

					return {
						barHeight: barHeight,
						x: xScale(xValue),
						y: y,
						className: getClassName(d, i),
						stroke: stroke ? getFill(d, i) : "none",
						fill: getFill(d, i),
						i,
					};
				}).filter(xValue => isDefined(xValue));

				var b = getBase(xScale, yScale, d);
				var w;
				for (var i = innerBars.length - 1; i >= 0; i--) {
					w = b - innerBars[i].x;
					if (w < 0) {
						innerBars[i].x = b;
						w = -1 * w;
					}
					innerBars[i].width = w;
					b = innerBars[i].x;
				};
				return innerBars;
			});

	return d3.merge(bars);
};
*/
export default wrap(HorizontalStackedBarSeries);
