'use strict';

import React from "react";
import d3 from "d3";
import objectAssign from "object-assign";

function d3_identity(d) {
	return d;
}

function tickTransform_svg_axisX(scale, tick) {
	return [scale(tick), 0];
}

function tickTransform_svg_axisY(scale, tick) {
	return [0, scale(tick)];
}

class Tick extends React.Component {
	render() {
		var { transform, tickStroke, textAnchor, fontSize, fontFamily } = this.props;
		var { x, y, x2, y2, dy } = this.props;
		return (
			<g className="tick" transform={`translate(${ transform[0] }, ${ transform[1] })`} >
				<line shapeRendering="crispEdges" opacity={1} stroke={tickStroke} x2={x2} y2={y2} />
				<text 
					dy={dy} x={x} y={y}
					fontSize={fontSize}
					fontFamily={fontFamily}
					textAnchor={textAnchor}>
					{this.props.children}
				</text>
			</g>
		);
	}
}

Tick.drawOnCanvasStatic = (tick, ctx, chartData, result) => {
	var { scale, tickTransform, tickStroke, dy, canvas_dy, x, y, x2, y2, textAnchor, fontSize, fontFamily, format } = result;
	var origin = tickTransform(scale, tick);

	ctx.beginPath();
	ctx.moveTo(origin[0], origin[1]);
	ctx.lineTo(origin[0] + x2, origin[1] + y2);
	ctx.stroke();

	ctx.font = `${ fontSize }px ${fontFamily}`;
	ctx.fillStyle = tickStroke;
	ctx.textAlign = textAnchor === "middle" ? "center" : textAnchor;
	ctx.textBaseline = 'middle';

	ctx.fillText(format(tick), origin[0] + x, origin[1] + y2 + y); 
}

class AxisTicks extends React.Component {
	render() {
		var result = AxisTicks.helper(this.props, this.props.scale);
		var { ticks, scale, tickTransform, tickStroke, dy, x, y, x2, y2, textAnchor, fontSize, fontFamily, format } = result;

		return (
			<g>
				{ticks.map((tick, idx) => {
					return (
						<Tick key={idx} transform={tickTransform(scale, tick)} tickStroke={tickStroke}
							dy={dy} x={x} y={y}
							x2={x2} y2={y2} textAnchor={textAnchor}
							fontSize={fontSize} fontFamily={fontFamily}>{format(tick)}</Tick>
					);
				})}
			</g>
		);
	}
}

AxisTicks.propTypes = {
	orient: React.PropTypes.oneOf(["top", "bottom", "left", "right"]).isRequired,
	innerTickSize: React.PropTypes.number,
	tickFormat: React.PropTypes.func,
	tickPadding: React.PropTypes.number,
	ticks: React.PropTypes.array,
	tickValues: React.PropTypes.array,
	scale: React.PropTypes.func.isRequired,
	tickStroke: React.PropTypes.string,
};

AxisTicks.defaultProps = {
	innerTickSize: 6,
	tickPadding: 3,
	ticks: [10],
	tickStroke: "#000",
};

AxisTicks.helper = (props, scale) => {
	var { orient, innerTickSize, tickFormat, tickPadding, fontSize, fontFamily, tickStroke } = props;
	var { tickSize, ticks : tickArguments, tickValues } = props;

	var ticks = tickValues === undefined
		? (scale.ticks
			? scale.ticks.apply(scale, tickArguments)
			: scale.domain())
		: tickValues;

	var format = tickFormat === undefined
		? (scale.tickFormat
			? scale.tickFormat.apply(scale, tickArguments)
			: d3_identity)
		: tickFormat;

	var sign = orient === "top" || orient === "left" ? -1 : 1;
	var tickSpacing = Math.max(innerTickSize, 0) + tickPadding;

	var tickTransform, x, y, x2, y2, dy, canvas_dy, textAnchor;

	if (orient === "bottom" || orient === "top") {
		tickTransform = tickTransform_svg_axisX;
		x2 = 0;
		y2 = sign * innerTickSize;
		x = 0;
		y = sign * tickSpacing;
		dy = sign < 0 ? "0em" : ".71em";
		canvas_dy = sign < 0 ? 0 : 3;
		textAnchor = "middle";
	} else {
		tickTransform = tickTransform_svg_axisY;
		x2 = sign * innerTickSize;
		y2 = 0;
		x = sign * tickSpacing;
		y = 0;
		dy = ".32em";
		canvas_dy = 3;
		textAnchor = sign < 0 ? "end" : "start";
	}
	return { ticks, scale, tickTransform, tickStroke, dy, canvas_dy, x, y, x2, y2, textAnchor, fontSize, fontFamily, format };
}

AxisTicks.drawOnCanvasStatic = (props, ctx, chartData, xScale, yScale) => {
	props = objectAssign({}, AxisTicks.defaultProps, props);

	var { orient } = props;
	var xAxis = (orient === "bottom" || orient === "top")

	var result = AxisTicks.helper(props, xAxis ? xScale : yScale);

	result.ticks.forEach((tick) => {
		Tick.drawOnCanvasStatic(tick, ctx, chartData, result);
	})
}

module.exports = AxisTicks;
