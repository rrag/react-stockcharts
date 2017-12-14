"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { forceSimulation, forceX, forceCollide } from "d3-force";
import { range as d3Range } from "d3-array";

import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";
import AxisZoomCapture from "./AxisZoomCapture";

import { first, last, hexToRGBA, isNotDefined, isDefined, identity, zipper, strokeDashTypes, getStrokeDasharray } from "../utils";

class Axis extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
		this.saveNode = this.saveNode.bind(this);
		this.getMoreProps = this.getMoreProps.bind(this);
	}
	saveNode(node) {
		this.node = node;
	}
	getMoreProps() {
		return this.node.getMoreProps();
	}
	drawOnCanvas(ctx, moreProps) {
		const { showDomain, showTicks, transform, range, getScale } = this.props;

		ctx.save();
		ctx.translate(transform[0], transform[1]);

		if (showDomain) drawAxisLine(ctx, this.props, range);
		if (showTicks) {
			const tickProps = tickHelper(this.props, getScale(moreProps));
			drawTicks(ctx, tickProps);
		}

		ctx.restore();
	}
	renderSVG(moreProps) {
		const { className } = this.props;
		const { showDomain, showTicks, range, getScale } = this.props;

		const ticks = showTicks ? axisTicksSVG(this.props, getScale(moreProps)) : null;
		const domain = showDomain ? axisLineSVG(this.props, range) : null;

		return <g className={className}>
			{ticks}
			{domain}
		</g>;
	}
	render() {
		const { bg, axisZoomCallback, zoomCursorClassName, zoomEnabled, getScale, inverted } = this.props;
		const { transform, getMouseDelta, edgeClip } = this.props;
		const { onContextMenu, onDoubleClick } = this.props;

		const zoomCapture = zoomEnabled
			? <AxisZoomCapture
				bg={bg}
				getScale={getScale}
				getMoreProps={this.getMoreProps}
				getMouseDelta={getMouseDelta}
				axisZoomCallback={axisZoomCallback}
				zoomCursorClassName={zoomCursorClassName}
				inverted={inverted}
				onContextMenu={onContextMenu}
				onDoubleClick={onDoubleClick}
			/>
			: null;

		return <g transform={`translate(${ transform[0] }, ${ transform[1] })`}>
			{zoomCapture}
			<GenericChartComponent ref={this.saveNode}
				canvasToDraw={getAxisCanvas}
				clip={false}
				edgeClip={edgeClip}
				svgDraw={this.renderSVG}
				canvasDraw={this.drawOnCanvas}
				drawOn={["pan"]}
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
	tickInterval: PropTypes.number,
	showDomain: PropTypes.bool,
	showTicks: PropTypes.bool,
	className: PropTypes.string,
	axisZoomCallback: PropTypes.func,
	zoomEnabled: PropTypes.bool,
	inverted: PropTypes.bool,
	zoomCursorClassName: PropTypes.string,
	transform: PropTypes.arrayOf(PropTypes.number).isRequired,
	range: PropTypes.arrayOf(PropTypes.number).isRequired,
	getMouseDelta: PropTypes.func.isRequired,
	getScale: PropTypes.func.isRequired,
	bg: PropTypes.object.isRequired,
	edgeClip: PropTypes.bool.isRequired,
	onContextMenu: PropTypes.func,
	onDoubleClick: PropTypes.func,
};

Axis.defaultProps = {
	zoomEnabled: false,
	zoomCursorClassName: "",
	edgeClip: false,
};

function tickHelper(props, scale) {
	const {
		orient, innerTickSize, tickFormat, tickPadding,
		tickLabelFill, tickStrokeWidth, tickStrokeDasharray,
		fontSize, fontFamily, showTicks, flexTicks,
		showTickLabel,
	} = props;
	const {
		ticks: tickArguments, tickValues: tickValuesProp,
		tickStroke, tickStrokeOpacity, tickInterval
	} = props;

	// if (tickArguments) tickArguments = [tickArguments];

	let tickValues;
	if (isDefined(tickValuesProp)) {
		tickValues = tickValuesProp;
	} else if (isDefined(tickInterval)) {
		const [min, max] = scale.domain();
		tickValues = d3Range(min, max, (max - min) / tickInterval);
	} else if (isDefined(scale.ticks)) {
		tickValues = scale.ticks(tickArguments, flexTicks);
	} else {
		tickValues = scale.domain();
	}

	const baseFormat = scale.tickFormat
		? scale.tickFormat(tickArguments)
		: identity;

	const format = isNotDefined(tickFormat)
		? baseFormat
		: d => tickFormat(d) || "";

	const sign = orient === "top" || orient === "left" ? -1 : 1;
	const tickSpacing = Math.max(innerTickSize, 0) + tickPadding;

	let ticks, dy, canvas_dy, textAnchor;

	if (orient === "bottom" || orient === "top") {
		dy = sign < 0 ? "0em" : ".71em";
		canvas_dy = sign < 0 ? 0 : (fontSize * .71);
		textAnchor = "middle";

		ticks = tickValues.map(d => {
			const x = Math.round(scale(d));
			return {
				value: d,
				x1: x,
				y1: 0,
				x2: x,
				y2: sign * innerTickSize,
				labelX: x,
				labelY: sign * tickSpacing,
			};
		});

		if (showTicks && flexTicks) {
			// console.log(ticks, showTicks);

			const nodes = ticks.map(d => ({ id: d.value, value: d.value, fy: d.y2, origX: d.x1 }));

			const simulation = forceSimulation(nodes)
				.force("x", forceX(d => d.origX).strength(1))
				.force("collide", forceCollide(22))
				// .force("center", forceCenter())
				.stop();

			for (let i = 0; i < 100; ++i) simulation.tick();
			// console.log(nodes);

			const zip = zipper()
				.combine((a, b) => {
					if (Math.abs(b.x - b.origX) > 0.01) {
						return {
							...a,
							x2: b.x,
							labelX: b.x
						};
					}
					return a;
				});

			ticks = zip(ticks, nodes);
		}


	} else {
		ticks = tickValues.map(d => {
			const y = Math.round(scale(d));
			return {
				value: d,
				x1: 0,
				y1: y,
				x2: sign * innerTickSize,
				y2: y,
				labelX: sign * tickSpacing,
				labelY: y,
			};
		});

		dy = ".32em";
		canvas_dy = (fontSize * .32);
		textAnchor = sign < 0 ? "end" : "start";
	}

	return {
		ticks, scale, tickStroke,
		tickLabelFill: (tickLabelFill || tickStroke),
		tickStrokeOpacity,
		tickStrokeWidth,
		tickStrokeDasharray,
		dy,
		canvas_dy,
		textAnchor,
		fontSize,
		fontFamily,
		format,
		showTickLabel,
	};
}

/* eslint-disable react/prop-types */
function axisLineSVG(props, range) {
	const { orient, outerTickSize } = props;
	const { domainClassName, fill, stroke, strokeWidth, opacity } = props;

	const sign = orient === "top" || orient === "left" ? -1 : 1;

	let d;

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

	const { orient, outerTickSize, stroke, strokeWidth, opacity } = props;

	const sign = orient === "top" || orient === "left" ? -1 : 1;
	const xAxis = (orient === "bottom" || orient === "top");

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
	const { tickLabelFill, tickStroke, tickStrokeOpacity, tickStrokeDasharray, tickStrokeWidth, textAnchor, fontSize, fontFamily } = props;
	const { x1, y1, x2, y2, labelX, labelY, dy } = props;
	return (
		<g className="tick">
			<line
				shapeRendering="crispEdges"
				opacity={tickStrokeOpacity}
				stroke={tickStroke}
				strokeWidth={tickStrokeWidth}
				strokeDasharray={getStrokeDasharray(tickStrokeDasharray)}
				x1={x1} y1={y1}
				x2={x2} y2={y2} />
			<text
				dy={dy} x={labelX} y={labelY}
				fill={tickLabelFill}
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
	x1: PropTypes.number.isRequired,
	y1: PropTypes.number.isRequired,
	x2: PropTypes.number.isRequired,
	y2: PropTypes.number.isRequired,
	labelX: PropTypes.number.isRequired,
	labelY: PropTypes.number.isRequired,
	dy: PropTypes.string.isRequired,
	tickStroke: PropTypes.string,
	tickLabelFill: PropTypes.string,
	tickStrokeWidth: PropTypes.number,
	tickStrokeOpacity: PropTypes.number,
	tickStrokeDasharray: PropTypes.oneOf(strokeDashTypes),
	textAnchor: PropTypes.string,
	fontSize: PropTypes.number,
	fontFamily: PropTypes.string,
};

function axisTicksSVG(props, scale) {
	const result = tickHelper(props, scale);

	const { tickLabelFill, tickStroke, tickStrokeOpacity, tickStrokeWidth, tickStrokeDasharray, textAnchor } = result;
	const { fontSize, fontFamily, ticks, format } = result;

	const { dy } = result;

	return (
		<g>
			{ticks.map((tick, idx) => {
				return (
					<Tick key={idx}
						tickStroke={tickStroke}
						tickLabelFill={tickLabelFill}
						tickStrokeWidth={tickStrokeWidth}
						tickStrokeOpacity={tickStrokeOpacity}
						tickStrokeDasharray={tickStrokeDasharray}
						dy={dy}
						x1={tick.x1} y1={tick.y1}
						x2={tick.x2} y2={tick.y2}
						labelX={tick.labelX} labelY={tick.labelY}
						textAnchor={textAnchor}
						fontSize={fontSize} fontFamily={fontFamily}>{format(tick.value)}</Tick>
				);
			})}
		</g>
	);
}

function drawTicks(ctx, result) {

	const { tickStroke, tickStrokeOpacity, tickLabelFill } = result;
	const { textAnchor, fontSize, fontFamily, ticks, showTickLabel } = result;

	ctx.strokeStyle = hexToRGBA(tickStroke, tickStrokeOpacity);

	ctx.fillStyle = tickStroke;
	// ctx.textBaseline = 'middle';

	ticks.forEach((tick) => {
		drawEachTick(ctx, tick, result);
	});

	ctx.font = `${ fontSize }px ${fontFamily}`;
	ctx.fillStyle = tickLabelFill;
	ctx.textAlign = textAnchor === "middle" ? "center" : textAnchor;

	if (showTickLabel) {
		ticks.forEach((tick) => {
			drawEachTickLabel(ctx, tick, result);
		});
	}
}

function drawEachTick(ctx, tick, result) {
	const { tickStrokeWidth, tickStrokeDasharray } = result;

	ctx.beginPath();

	ctx.moveTo(tick.x1, tick.y1);
	ctx.lineTo(tick.x2, tick.y2);
	ctx.lineWidth = tickStrokeWidth;
	ctx.setLineDash(getStrokeDasharray(tickStrokeDasharray).split(","));
	ctx.stroke();
}

function drawEachTickLabel(ctx, tick, result) {
	const { canvas_dy, format } = result;

	ctx.beginPath();
	ctx.fillText(format(tick.value), tick.labelX, tick.labelY + canvas_dy);
}

export default Axis;
