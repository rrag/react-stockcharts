"use strict";

import React from "react";
import objectAssign from "object-assign";

import { hexToRGBA } from "../utils/utils";

function d3_identity(d) {
	return d;
}

function tickTransform_svg_axisX(scale, tick) {
	return [~~ (0.5 + scale(tick)), 0];
}

function tickTransform_svg_axisY(scale, tick) {
	return [0, ~~ (0.5 + scale(tick))];
}

class Tick extends React.Component {
	render() {
		var { transform, tickStroke, tickStrokeOpacity, textAnchor, fontSize, fontFamily } = this.props;
		var { x, y, x2, y2, dy } = this.props;
		return (
			<g className="tick" transform={`translate(${ transform[0] }, ${ transform[1] })`} >
				<line shapeRendering="crispEdges" opacity={tickStrokeOpacity} stroke={tickStroke} x2={x2} y2={y2} />
				<text
					dy={dy} x={x} y={y}
					fill={tickStroke}
					fontSize={fontSize}
					fontFamily={fontFamily}
					textAnchor={textAnchor}>
					{this.props.children}
				</text>
			</g>
		);
	}
}

Tick.propTypes = {
	transform: React.PropTypes.arrayOf(Number),
	tickStroke: React.PropTypes.string,
	tickStrokeOpacity: React.PropTypes.number,
	textAnchor: React.PropTypes.string,
	fontSize: React.PropTypes.number,
	fontFamily: React.PropTypes.string,
	x: React.PropTypes.number,
	y: React.PropTypes.number,
	x2: React.PropTypes.number,
	y2: React.PropTypes.number,
	dy: React.PropTypes.string,
	children: React.PropTypes.node.isRequired,
};

Tick.drawOnCanvasStatic = (tick, ctx, result) => {
	var { scale, tickTransform, canvas_dy, x, y, x2, y2, format } = result;

	var origin = tickTransform(scale, tick);

	ctx.beginPath();

	ctx.moveTo(origin[0], origin[1]);
	ctx.lineTo(origin[0] + x2, origin[1] + y2);
	ctx.stroke();

	ctx.fillText(format(tick), origin[0] + x, origin[1] + y + canvas_dy);
};

class AxisTicks extends React.Component {
	render() {
		var result = AxisTicks.helper(this.props, this.props.scale);
		var { ticks, scale, tickTransform, tickStroke, tickStrokeOpacity, dy, x, y, x2, y2, textAnchor, fontSize, fontFamily, format } = result;

		return (
			<g>
				{ticks.map((tick, idx) => {
					return (
						<Tick key={idx} transform={tickTransform(scale, tick)}
							tickStroke={tickStroke} tickStrokeOpacity={tickStrokeOpacity}
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
	tickStrokeOpacity: React.PropTypes.number,
};

AxisTicks.defaultProps = {
	innerTickSize: 5,
	tickPadding: 6,
	ticks: [10],
	tickStroke: "#000",
	tickStrokeOpacity: 1,
};

AxisTicks.helper = (props, scale) => {
	var { orient, innerTickSize, tickFormat, tickPadding, fontSize, fontFamily } = props;
	var { ticks: tickArguments, tickValues, tickStroke, tickStrokeOpacity } = props;

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
		canvas_dy = sign < 0 ? 0 : (fontSize * .71);
		textAnchor = "middle";
	} else {
		tickTransform = tickTransform_svg_axisY;
		x2 = sign * innerTickSize;
		y2 = 0;
		x = sign * tickSpacing;
		y = 0;
		dy = ".32em";
		canvas_dy = (fontSize * .32);
		textAnchor = sign < 0 ? "end" : "start";
	}
	return { ticks, scale, tickTransform, tickStroke, tickStrokeOpacity, dy, canvas_dy, x, y, x2, y2, textAnchor, fontSize, fontFamily, format };
};

AxisTicks.drawOnCanvasStatic = (props, ctx, xScale, yScale) => {
	props = objectAssign({}, AxisTicks.defaultProps, props);

	var { orient } = props;
	var xAxis = (orient === "bottom" || orient === "top");

	var result = AxisTicks.helper(props, xAxis ? xScale : yScale);

	var { tickStroke, tickStrokeOpacity, textAnchor, fontSize, fontFamily } = result;

	ctx.strokeStyle = hexToRGBA(tickStroke, tickStrokeOpacity);

	ctx.font = `${ fontSize }px ${fontFamily}`;
	ctx.fillStyle = tickStroke;
	ctx.textAlign = textAnchor === "middle" ? "center" : textAnchor;
	// ctx.textBaseline = 'middle';

	result.ticks.forEach((tick) => {
		Tick.drawOnCanvasStatic(tick, ctx, result);
	});
};

export default AxisTicks;
