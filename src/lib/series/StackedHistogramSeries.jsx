"use strict";

import React from "react";

import wrap from "./wrap";

import identity from "../utils/identity";
import { isDefined, isNotDefined, hexToRGBA } from "../utils/utils";

class StackedHistogramSeries extends React.Component {
	render() {
		var { props } = this;
		return <g className="histogram">
			{StackedHistogramSeries.getBarsSVG(props)}
		</g>;
	}
}

StackedHistogramSeries.propTypes = {
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
	yAccessor: React.PropTypes.arrayOf(React.PropTypes.func),
	yAccessorNarrow: React.PropTypes.arrayOf(React.PropTypes.func),
	xScale: React.PropTypes.func,
	yScale: React.PropTypes.func,
	plotData: React.PropTypes.array,
};

StackedHistogramSeries.defaultProps = {
	baseAt: "bottom",
	direction: "up",
	className: "bar",
	stroke: false,
	fill: "#4682B4",
	opacity: 1,
	widthRatio: 0.5,
};

StackedHistogramSeries.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {
	var { xAccessor, yAccessor, stroke } = props;

	var bars = StackedHistogramSeries.getBars(props, xAccessor, yAccessor, xScale, yScale, plotData);

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

StackedHistogramSeries.getBarsSVG = (props) => {

	/* eslint-disable react/prop-types */
	var { xAccessor, yAccessor, xScale, yScale, plotData } = props;
	/* eslint-disable react/prop-types */

	var bars = StackedHistogramSeries.getBars(props, xAccessor, yAccessor, xScale, yScale, plotData);

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

StackedHistogramSeries.getBars = (props, xAccessor, yAccessor, xScale, yScale, plotData) => {
	var { baseAt, className, fill, stroke, widthRatio, yAccessorNarrow } = props;
	var base = baseAt === "top"
				? 0
				: baseAt === "bottom"
					? yScale.range()[0]
					: baseAt === "middle"
						? (yScale.range()[0] + yScale.range()[1]) / 2
						: baseAt;

	var getClassName = d3.functor(className);
	var getFill = d3.functor(fill);
	var getBase = d3.functor(base);

	var width = xScale(xAccessor(plotData[plotData.length - 1]))
		- xScale(xAccessor(plotData[0]));
	var bw = (width / (plotData.length - 1) * widthRatio);
	var barWidth = Math.round(bw);
	var offset = (barWidth === 1 ? 0 : 0.5 * barWidth);

	var bars = plotData
			.map(d => {
				var innerBars = yAccessor.map((eachYAccessor, i) => {
					var yValue = eachYAccessor(d);
					if (isDefined(yAccessorNarrow) && isDefined(yAccessorNarrow[i])) {
						yValue = yAccessorNarrow[i](eachYAccessor(d));
					} 
					if (isNotDefined(yValue)) return undefined;

					var x = Math.round(xScale(xAccessor(d))) - offset;
					return {
						barWidth: barWidth,
						x: x,
						y: yScale(yValue),
						className: getClassName(d, i),
						stroke: stroke ? getFill(d, i) : "none",
						fill: getFill(d, i),
						i,
					};
				}).filter(yValue => yValue !== undefined);

				var b = getBase(xScale, yScale, d);
				var h;
				for (var i = innerBars.length - 1; i >= 0; i--) {
					h = b - innerBars[i].y
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

export default wrap(StackedHistogramSeries);
