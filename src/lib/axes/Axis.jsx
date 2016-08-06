"use strict";

import React, { PropTypes, Component } from "react";

import GenericChartComponent, { getAxisCanvas } from "../GenericChartComponent";
import AxisZoomCapture from "./AxisZoomCapture";

import { first, last, hexToRGBA, isNotDefined, isDefined, identity } from "../utils";

class Axis extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
		this.getMoreProps = this.getMoreProps.bind(this);

	}
	drawOnCanvas(ctx, moreProps) {
		var { showDomain, showTicks, transform, range, getScale } = this.props;

		ctx.save();
		ctx.translate(transform[0], transform[1]);

		if (showDomain) drawAxisLine(ctx, this.props, range);
		if (showTicks) {
			var tickProps = tickHelper(this.props, getScale(moreProps));
			drawTicks(ctx, tickProps);
		}

		ctx.restore();
	}
	renderSVG(moreProps) {
		var { className } = this.props;
		var { showDomain, showTicks, range, getScale } = this.props;

		var ticks = showTicks ? axisTicksSVG(this.props, getScale(moreProps)) : null;
		var domain = showDomain ? axisLineSVG(this.props, range) : null;

		return <g className={className}>
			{ticks}
			{domain}
		</g>;
	}
	getMoreProps() {
		return this.refs.propProvider.getMoreProps();
	}
	render() {
		var { bg, axisZoomCallback, zoomCursorClassName, zoomEnabled, getScale } = this.props;
		var { transform, getMouseDelta, edgeClip } = this.props;

		var zoomCapture = zoomEnabled
			? <AxisZoomCapture
				bg={bg}
				getScale={getScale}
				getMoreProps={this.getMoreProps}
				getMouseDelta={getMouseDelta}
				axisZoomCallback={axisZoomCallback}
				zoomCursorClassName={zoomCursorClassName} />
			: null;

		return <g transform={`translate(${ transform[0] }, ${ transform[1] })`}>
			{zoomCapture}
			<GenericChartComponent ref="propProvider"
				canvasToDraw={getAxisCanvas}
				clip={false}
				edgeClip={edgeClip}
				svgDraw={this.renderSVG}
				canvasDraw={this.drawOnCanvas}
				drawOnPan
				/>
		</g>;
	}
}

Axis.propTypes = {
	innerTickSize: PropTypes.number,
	outerTickSize: PropTypes.number,
	tickFormat: PropTypes.func,
	tickPadding: PropTypes.number,
	tickSize: PropTypes.number,
	ticks: PropTypes.number,
	tickValues: PropTypes.array,
	showDomain: PropTypes.bool,
	showTicks: PropTypes.bool,
	className: PropTypes.string,
	axisZoomCallback: PropTypes.func,
	zoomEnabled: PropTypes.bool,
	zoomCursorClassName: PropTypes.string,
	transform: PropTypes.arrayOf(PropTypes.number).isRequired,
	range: PropTypes.arrayOf(PropTypes.number).isRequired,
	getMouseDelta: PropTypes.func.isRequired,
	getScale: PropTypes.func.isRequired,
	bg: PropTypes.object.isRequired,
};

Axis.defaultProps = {
	zoomEnabled: false,
	zoomCursorClassName: "",
	edgeClip: false,
};

Axis.contextTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
};

function tickTransform_svg_axisX(scale, tick) {
	return [Math.round(scale(tick)), 0];
}

function tickTransform_svg_axisY(scale, tick) {
	return [0, Math.round(scale(tick))];
}

function tickHelper(props, scale) {
	var { orient, innerTickSize, tickFormat, tickPadding, fontSize, fontFamily } = props;
	var { ticks: tickArguments, tickValues, tickStroke, tickStrokeOpacity } = props;

	if (tickArguments) tickArguments = [tickArguments];

	var ticks = isNotDefined(tickValues)
		? (isDefined(scale.ticks)
			? scale.ticks.apply(scale, tickArguments)
			: scale.domain())
		: tickValues;

	var baseFormat = scale.tickFormat
			? scale.tickFormat.apply(scale, tickArguments)
			: identity;

	var format = isNotDefined(tickFormat)
		? baseFormat
		: d => baseFormat(d) ? tickFormat(d) : "";

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
}

/* eslint-disable react/prop-types */
function axisLineSVG(props, range) {
	var { orient, outerTickSize } = props;
	var { domainClassName, fill, stroke, strokeWidth, opacity } = props;

	var sign = orient === "top" || orient === "left" ? -1 : 1;

	var d;

	if (orient === "bottom" || orient === "top") {
		d = "M" + range[0] + "," + sign * outerTickSize + "V0H" + range[1] + "V" + sign * outerTickSize;
	} else {
		d = "M" + sign * outerTickSize + "," + range[0] + "H0V" + range[1] + "H" + sign * outerTickSize;
	}

	return (
		<path
			className={domainClassName}
			d={d}
			fill={fill}
			opacity={opacity}
			stroke={stroke}
			strokeWidth={strokeWidth} >
		</path>
	);
}
/* eslint-enable react/prop-types */


function drawAxisLine(ctx, props, range) {
	// props = { ...AxisLine.defaultProps, ...props };

	var { orient, outerTickSize, stroke, strokeWidth, opacity } = props;

	var sign = orient === "top" || orient === "left" ? -1 : 1;
	var xAxis = (orient === "bottom" || orient === "top");

	// var range = d3_scaleRange(xAxis ? xScale : yScale);

	ctx.lineWidth = strokeWidth;
	ctx.strokeStyle = hexToRGBA(stroke, opacity);

	ctx.beginPath();

	if (xAxis) {
		ctx.moveTo(first(range), sign * outerTickSize);
		ctx.lineTo(first(range), 0);
		ctx.lineTo(last(range), 0);
		ctx.lineTo(last(range), sign * outerTickSize);
	} else {
		ctx.moveTo(sign * outerTickSize, first(range));
		ctx.lineTo(0, first(range));
		ctx.lineTo(0, last(range));
		ctx.lineTo(sign * outerTickSize, last(range));
	}
	ctx.stroke();
}

function Tick(props) {
	var { transform, tickStroke, tickStrokeOpacity, textAnchor, fontSize, fontFamily } = props;
	var { x, y, x2, y2, dy } = props;
	return (
		<g className="tick" transform={`translate(${ transform[0] }, ${ transform[1] })`} >
			<line shapeRendering="crispEdges" opacity={tickStrokeOpacity} stroke={tickStroke} x2={x2} y2={y2} />
			<text
				dy={dy} x={x} y={y}
				fill={tickStroke}
				fontSize={fontSize}
				fontFamily={fontFamily}
				textAnchor={textAnchor}>
				{props.children}
			</text>
		</g>
	);
}

Tick.propTypes = {
	children: PropTypes.string.isRequired,
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	x2: PropTypes.number.isRequired,
	y2: PropTypes.number.isRequired,
	dy: PropTypes.string.isRequired,
	transform: PropTypes.array,
	tickStroke: PropTypes.string,
	tickStrokeOpacity: PropTypes.number,
	textAnchor: PropTypes.string,
	fontSize: PropTypes.number,
	fontFamily: PropTypes.string,
};

function axisTicksSVG(props, scale) {
	var result = tickHelper(props, scale);

	var { tickStroke, tickStrokeOpacity, textAnchor, tickTransform } = result;
	var { fontSize, fontFamily, ticks, format } = result;

	var { dy, x, y, x2, y2 } = result;

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

function drawTicks(ctx, result) {

	var { tickStroke, tickStrokeOpacity, textAnchor, fontSize, fontFamily, ticks } = result;

	ctx.strokeStyle = hexToRGBA(tickStroke, tickStrokeOpacity);

	ctx.font = `${ fontSize }px ${fontFamily}`;
	ctx.fillStyle = tickStroke;
	ctx.textAlign = textAnchor === "middle" ? "center" : textAnchor;
	// ctx.textBaseline = 'middle';

	ticks.forEach((tick) => {
		drawEachTick(ctx, tick, result);
	});
}

function drawEachTick(ctx, tick, result) {
	var { scale, tickTransform, canvas_dy, x, y, x2, y2, format } = result;

	var origin = tickTransform(scale, tick);

	ctx.beginPath();

	ctx.moveTo(origin[0], origin[1]);
	ctx.lineTo(origin[0] + x2, origin[1] + y2);
	ctx.stroke();

	ctx.fillText(format(tick), origin[0] + x, origin[1] + y + canvas_dy);
}

export default Axis;
