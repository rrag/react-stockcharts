"use strict";

import React from "react";
import wrap from "./wrap";

const HistogramSeries = (props) => 
	<g className="histogram">
		{HistogramSeries.getBarsSVG(props)}
	</g>;

HistogramSeries.propTypes = {
	baseAt: React.PropTypes.oneOfType([
				React.PropTypes.oneOf(["top", "bottom", "middle"]),
				React.PropTypes.number,
				React.PropTypes.func,
			]).isRequired,
	direction: React.PropTypes.oneOf(["up", "down"]).isRequired,
	stroke: React.PropTypes.string,
	opacity: React.PropTypes.number.isRequired,
	fill: React.PropTypes.oneOfType([
			React.PropTypes.func, React.PropTypes.string
		]).isRequired,
	className: React.PropTypes.oneOfType([
			React.PropTypes.func, React.PropTypes.string
		]).isRequired,
};

HistogramSeries.defaultProps = {
	baseAt: "bottom",
	direction: "up",
	className: "bar",
	stroke: "none",
	fill: "steelblue",
	opacity: 0.5,
};

HistogramSeries.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {
	var { height, width, xAccessor, yAccessor } = props;

	var bars = HistogramSeries.getBars(props, xAccessor, yAccessor, xScale, yScale, plotData);

	ctx.globalAlpha = props.opacity;

	var each, group = {};
	for (var i = 0; i < bars.length; i++) {
		each = bars[i];
		if (each.x !== undefined) {
			if (group[each.fill] === undefined) {
				group[each.fill] = [];
			}
			group[each.fill].push(each);
		}
	};

	Object.keys(group).forEach(key => {
		if (group[key][0].barWidth < 1) {
			ctx.strokeStyle = key;
		} else {
			ctx.fillStyle = key;
		}
		group[key].forEach(d => {
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
			}
		});
	});
};

HistogramSeries.getBarsSVG = (props) => {
	var { xAccessor, yAccessor, xScale, yScale, plotData } = props;

	var bars = HistogramSeries.getBars(props, xAccessor, yAccessor, xScale, yScale, plotData);

	return bars.map((d, idx) => {
		if (d.barWidth <= 1) {
			return <line key={idx} className={d.className}
						stroke={d.stroke}
						fill={d.fill}
						x1={d.x} y1={d.y}
						x2={d.x} y2={d.y + d.height} />;
		}
		return <rect key={idx} className={d.className}
					stroke={d.stroke}
					fill={d.fill}
					x={d.x}
					y={d.y}
					width={d.barWidth}
					opacity={props.opacity}
					height={d.height} />;
	});
};

HistogramSeries.getBars = (props, xAccessor, yAccessor, xScale, yScale, plotData) => {
	var { baseAt, direction, className, fill, stroke } = props;
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
	var barWidth = (width / (plotData.length) * 0.5);

	var bars = plotData
			.filter((d) => (yAccessor(d) !== undefined) )
			.map((d, idx) => {
				var yValue = yAccessor(d);
				var x = (xScale(xAccessor(d))) - 0.5 * barWidth,
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
					stroke: stroke,
					fill: getFill(d),
				};
			});
	return bars;
};

export default wrap(HistogramSeries);
