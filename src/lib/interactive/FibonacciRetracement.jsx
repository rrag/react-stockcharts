"use strict";

import React, { PropTypes, Component } from "react";

import { isDefined, isNotDefined, head, last, noop } from "../utils";

import InteractiveLine from "./InteractiveLine";
import MouseLocationIndicator from "./MouseLocationIndicator";

class FibonacciRetracement extends Component {
	constructor(props) {
		super(props);

		this.handleStartAndEnd = this.handleStartAndEnd.bind(this);
		this.handleDrawRetracement = this.handleDrawRetracement.bind(this);

		this.handleEdge1Drag = this.handleEdge1Drag.bind(this);
		this.handleEdge2Drag = this.handleEdge2Drag.bind(this);

		this.handleDrag = this.handleDrag.bind(this);
		this.handleDragComplete = this.handleDragComplete.bind(this);

		this.state = this.props.init;
	}
	removeLast() {
		var { retracements } = this.state;
		if (isDefined(retracements) && retracements.length > 0) {
			this.setState({
				retracements: retracements.slice(0, retracements.length - 1),
			});
		}
	}
	terminate() {
		this.setState({
			current: null,
			override: null,
		});
	}
	handleStartAndEnd(xyValue) {
		var { current, retracements } = this.state;

		if (isNotDefined(current) || isNotDefined(current.x1)) {
			this.setState({
				current: {
					x1: xyValue[0],
					y1: xyValue[1],
					x2: null,
					y2: null,
				}
			}, () => {
				this.props.onStart();
			});
		} else {
			this.setState({
				retracements: retracements.concat({ ...current, x2: xyValue[0], y2: xyValue[1] }),
				current: null,
			}, () => {
				this.props.onComplete();
			});
		}
	}
	handleDrawRetracement(xyValue) {
		var { current } = this.state;

		if (isDefined(current) && isDefined(current.x1)) {
			this.setState({
				current: {
					...current,
					x2: xyValue[0],
					y2: xyValue[1],
				}
			});
		}
	}
	handleDrag(echo, newXYValue, origXYValue) {
		var { retracements } = this.state;
		var { index } = echo;
		var dy = origXYValue.y1Value - newXYValue.y1Value;

		this.setState({
			override: {
				index,
				x1: newXYValue.x1Value,
				y1: retracements[index].y1 - dy,
				x2: newXYValue.x2Value,
				y2: retracements[index].y2 - dy,
			}
		});
	}
	handleEdge1Drag(echo, newXYValue, origXYValue) {
		var { retracements } = this.state;
		var { index } = echo;

		var dx = origXYValue.x1Value - newXYValue.x1Value;

		this.setState({
			override: {
				index,
				x1: retracements[index].x1 - dx,
				y1: retracements[index].y1,
				x2: retracements[index].x2,
				y2: retracements[index].y2,
			}
		});
	}
	handleEdge2Drag(echo, newXYValue, origXYValue) {
		var { retracements } = this.state;
		var { index } = echo;

		var dx = origXYValue.x2Value - newXYValue.x2Value;

		this.setState({
			override: {
				index,
				x1: retracements[index].x1,
				y1: retracements[index].y1,
				x2: retracements[index].x2 - dx,
				y2: retracements[index].y2,
			}
		});
	}
	handleDragComplete() {
		var { retracements, override } = this.state;

		if (isDefined(override)) {
			var { index, ...rest } = override;

			var newRetracements = retracements
				.map((each, idx) => idx === index
					? rest
					: each);

			this.setState({
				override: null,
				retracements: newRetracements
			});
		}
	}
	render() {
		var { retracements, current, override } = this.state;
		var { stroke, strokeWidth, opacity, fontFamily, fontSize, fontStroke, type } = this.props;

		var lineType = type === "EXTEND" ? "XLINE" : "LINE";

		var { enabled } = this.props;

		var currentRetracement = null;
		if (isDefined(current) && isDefined(current.x2)) {
			var lines = helper(current);
			var dir = head(lines).y1 > last(lines).y1 ? 3 : -1.3;

			currentRetracement = lines.map((line, idx) => {
				var text = `${ line.y.toFixed(2) } (${ line.percent.toFixed(2) }%)`;

				return <InteractiveLine key={idx}
					type={lineType}
					x1Value={line.x1}
					y1Value={line.y}
					x2Value={line.x2}
					y2Value={line.y}

					childProps={{ dir, text, fontFamily, fontSize, fontStroke }}

					stroke={stroke} strokeWidth={strokeWidth} opacity={opacity}>
					{retracementText}
				</InteractiveLine>;
			});
		}

		return <g>
			{retracements.map((each, idx) => {
				var lines = helper(isDefined(override) && override.index === idx ? override : each);

				var dir = head(lines).y1 > last(lines).y1 ? 3 : -1.3;
				return lines.map((line, j) => {
					var text = `${ line.y.toFixed(2) } (${ line.percent.toFixed(2) }%)`;

					return <InteractiveLine key={`${idx}-${j}`} withEdge
						echo={{ index: idx, idx: j }} type={lineType}
						defaultClassName="react-stockcharts-enable-interaction react-stockcharts-move-cursor"
						x1Value={line.x1}
						y1Value={line.y}
						x2Value={line.x2}
						y2Value={line.y}

						childProps={{ dir, text, fontFamily, fontSize, fontStroke }}

						stroke={stroke} strokeWidth={strokeWidth} opacity={opacity}
						onEdge1Drag={this.handleEdge1Drag}
						onEdge2Drag={this.handleEdge2Drag}
						onDrag={this.handleDrag}
						onDragComplete={this.handleDragComplete}>
						{retracementText}
					</InteractiveLine>;
				});
			})}
			{currentRetracement}
			<MouseLocationIndicator
				enabled={enabled}
				snap={false}
				r={0}
				onMouseDown={this.handleStartAndEnd}
				onMouseMove={this.handleDrawRetracement} />
		</g>;
	}
}

/* eslint-disable react/prop-types */

function retracementText({ xScale, chartConfig }, props, modLine) {
	var { text, dir, fontStroke, fontFamily, fontSize } = props.childProps;
	var { x1, y1, x2 } = modLine;
	return <text
		x={xScale(Math.min(x1, x2)) + 10}
		y={chartConfig.yScale(y1) + dir * 4}
		fontFamily={fontFamily}
		fontSize={fontSize}
		fill={fontStroke}>{text}</text>;
}
/* eslint-enable react/prop-types */

function helper({ x1, y1, x2, y2 }) {
	var dy = y2 - y1;
	var retracements = [100, 61.8, 50, 38.2, 23.6, 0]
		.map(each => ({
			percent: each,
			x1,
			x2,
			y: (y2 - (each / 100) * dy),
		}));

	return retracements;
}

FibonacciRetracement.propTypes = {
	enabled: PropTypes.bool.isRequired,
	fontFamily: PropTypes.string.isRequired,
	fontSize: PropTypes.number.isRequired,
	chartCanvasType: PropTypes.string,
	interactive: PropTypes.object,
	width: PropTypes.number,
	strokeWidth: PropTypes.number,
	stroke: PropTypes.string,
	opacity: PropTypes.number,
	fontStroke: PropTypes.string,
	onStart: PropTypes.func,
	onComplete: PropTypes.func,
	type: PropTypes.oneOf([
		"EXTEND", // extends from -Infinity to +Infinity
		"BOUND", // extends between the set bounds
	]).isRequired,
	mouseXY: PropTypes.array,
	currentItem: PropTypes.object,
	interactiveState: PropTypes.object,
	overrideInteractive: PropTypes.func,
	childProps: PropTypes.any,
	init: PropTypes.object.isRequired,
};

FibonacciRetracement.defaultProps = {
	enabled: true,
	stroke: "#000000",
	strokeWidth: 1,
	opacity: 0.4,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 10,
	fontStroke: "#000000",
	type: "EXTEND",
	init: { retracements: [] },
	onStart: noop,
	onComplete: noop,
};

export default FibonacciRetracement;
