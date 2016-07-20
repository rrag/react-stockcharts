"use strict";

import React, { PropTypes, Component } from "react";
import makeInteractive from "./makeInteractive";
import { isDefined, head, last, hexToRGBA, noop, d3Window, MOUSEMOVE, MOUSEUP } from "../utils";



class FibonacciRetracement extends Component {
	constructor(props) {
		super(props);
		this.onMousemove = this.onMousemove.bind(this);
		this.onClick = this.onClick.bind(this);
		this.handleMoveStart = this.handleMoveStart.bind(this);
		this.handleResizeStart = this.handleResizeStart.bind(this);

		this.state = {
			hover: false,
		};
	}
	removeLast(interactive) {
		var { retracements, start } = interactive;
		if (!start && retracements.length > 0) {
			return { ...interactive, retracements: retracements.slice(0, retracements.length - 1) };
		}
		return interactive;
	}
	terminate(interactive) {
		var { start } = interactive;
		if (start) {
			return { ...interactive, start: null };
		}
		return interactive;
	}
	handleMoveStart(idx, e) {
		var { mouseXY, chartConfig, xScale, xAccessor, currentItem } = this.props;
		var { yScale } = chartConfig;

		var startY = mouseXY[1];

		this.moveStartPosition = [xAccessor(currentItem), yScale.invert(startY)];

		var win = d3Window(this.refs.fib);
		d3.select(win)
			.on(MOUSEMOVE, this.handleMove.bind(this, idx))
			.on(MOUSEUP, this.handleMoveEnd.bind(this, idx));

		e.preventDefault();
	}
	handleResizeStart(idx, line, e) {
		var { mouseXY } = this.props;

		console.log(idx, line);
		e.preventDefault();
	}
	handleMove(idx) {
		var { mouseXY, interactiveState, chartConfig, xScale } = this.props;
		var { type, xAccessor, currentItem, plotData } = this.props;

		var { yScale } = chartConfig;
		var endY = mouseXY[1];

		var [startXValue, startYValue] = this.moveStartPosition;
		var [endXValue, endYValue] = [xAccessor(currentItem), yScale.invert(endY)];

		var dx = endXValue - startXValue;
		var dy = endYValue - startYValue;

		var { start, end } = interactiveState.retracements[idx];
		var newStart = [start[0] + dx, start[1] + dy];
		var newEnd = [end[0] + dx, end[1] + dy];

		var retracement = generateLine(type, newStart, newEnd, xAccessor, plotData);

		var override = {
			index: idx,
			retracement,
			start: newStart,
			end: newEnd,
		};

		this.setState({
			override
		});
	}
	handleMoveEnd(idx) {
		var win = d3Window(this.refs.fib);
		var { overrideInteractive, interactiveState } = this.props;
		var { override } = this.state;
		var { start, end } = override;

		if (isDefined(override)) {
			var retracements = interactiveState.retracements
				.map((each, i) => (i === idx) ? { start, end } : each);

			overrideInteractive({ retracements }, () => {
				this.setState({
					override: null
				});
			});
		}
		this.moveStartPosition = null;
		d3.select(win)
			.on(MOUSEMOVE, null)
			.on(MOUSEUP, null);

	}
	isStart(interactive) {
		return interactive.status === "start";
	}
	isComplete(interactive) {
		return interactive.status === "complete";
	}
	onMousemove(state) {
		var {
			xScale,
			plotData,
			mouseXY,
			currentCharts,
			currentItem,
			chartConfig,
			interactiveState,
			eventMeta,
		} = state;

		var { enabled, xAccessor } = this.props;
		if (enabled) {
			var { yScale } = chartConfig;

			var yValue = yScale.invert(mouseXY[1]);
			var xValue = xAccessor(currentItem);

			if (interactiveState.start) {
				var status =  "inprogress";
				return { ...interactiveState, tempEnd: [xValue, yValue], status };
			}
		}
		return interactiveState;
	}
	onClick(state) {
		var {
			xScale,
			plotData,
			mouseXY,
			currentCharts,
			currentItem,
			chartConfig,
			interactiveState,
			eventMeta,
		} = state;

		var { enabled, xAccessor } = this.props;
		if (enabled) {
			var { start, retracements } = interactiveState;

			var { yScale } = chartConfig;

			var yValue = yScale.invert(mouseXY[1]);
			var xValue = xAccessor(currentItem);

			if (start) {
				return {
					...interactiveState,
					start: null,
					tempEnd: null,
					retracements: retracements.concat({ start, end: [xValue, yValue] }),
					status: "complete",
				};
			} else if (eventMeta.button === 0) {
				return {
					...interactiveState,
					start: [xValue, yValue],
					tempEnd: null,
					status: "start",
				};
			}
		}
		return interactiveState;
	}
	render() {
		var { chartCanvasType, chartConfig, plotData, xScale, xAccessor, interactiveState } = this.props;
		var { stroke, opacity, fontFamily, fontSize, fontStroke, type, enabled } = this.props;

		var { override } = this.state;

		var { yScale } = chartConfig;
		var retracements = helper(plotData, type, xAccessor, interactiveState, chartConfig);
		var className = enabled || isDefined(override) ? "react-stockcharts-avoid-interaction" : "";
		return (
			<g className={className} ref="fib">
				{retracements.map((eachRetracement, idx) => {
					if (isDefined(override) && idx === override.index) {
						eachRetracement = override.retracement;
					}
					var dir = eachRetracement[0].y1 > eachRetracement[eachRetracement.length - 1].y1 ? 3 : -1.3;

					return <g key={idx}>
						{eachRetracement.map((line, i) => {
							var text = `${ line.y.toFixed(2) } (${ line.percent.toFixed(2) }%)`;

							var { className: cursorClassName, onMouseDown } = enabled
								? ""
								: (i === 0 || i === eachRetracement.length - 1)
									? {
										className: "react-stockcharts-ns-resize-cursor",
										onMouseDown: this.handleResizeStart.bind(this, idx, i === 0 ? "start" : "end")
									}
									: {
										className: "react-stockcharts-move-cursor",
										onMouseDown: this.handleMoveStart.bind(this, idx)
									};

							return (<g key={i} className={cursorClassName}
									onMouseDown={onMouseDown}>
								<line
									x1={xScale(line.x1)} y1={yScale(line.y)}
									x2={xScale(line.x2)} y2={yScale(line.y)}
									stroke={stroke} opacity={opacity} />
								<line
									x1={xScale(line.x1)} y1={yScale(line.y)}
									x2={xScale(line.x2)} y2={yScale(line.y)}
									stroke={stroke} strokeWidth={7} opacity={0} />
								<text x={xScale(Math.min(line.x1, line.x2)) + 10} y={yScale(line.y) + dir * 4}
									fontFamily={fontFamily} fontSize={fontSize} fill={fontStroke}>{text}</text>
							</g>);
						})}
					</g>;
				})}
			</g>
		);
	}
}

function getCoordinate(idx, override, coords, key) {
	if (isDefined(override)) {
		var { index } = override;
		if (index === idx) {
			if (isDefined(override[key])) {
				return override[key];
			}
		}
	}
	return coords[key];
}

function helper(plotData, type, xAccessor, interactive/* , chartConfig */) {
	var { retracements, start, tempEnd } = interactive;

	var temp = retracements;

	if (start && tempEnd) {
		temp = temp.concat({ start, end: tempEnd });
	}
	var lines = temp
		.map(each => generateLine(type, each.start, each.end, xAccessor, plotData));

	return lines;
}

function generateLine(type, start, end, xAccessor, plotData) {
	var dy = end[1] - start[1];
	var retracements = [100, 61.8, 50, 38.2, 23.6, 0]
		.map(each => ({
			percent: each,
			x1: type === "EXTEND" ? xAccessor(head(plotData)) : start[0],
			x2: type === "EXTEND" ? xAccessor(last(plotData)) : end[0],
			y: (end[1] - (each / 100) * dy),
		}));

	return retracements;
}

FibonacciRetracement.propTypes = {
	snap: PropTypes.bool.isRequired,
	enabled: PropTypes.bool.isRequired,
	snapTo: PropTypes.func,
	fontFamily: PropTypes.string.isRequired,
	fontSize: PropTypes.number.isRequired,
	chartCanvasType: PropTypes.string,
	chartConfig: PropTypes.object,
	plotData: PropTypes.array,
	xAccessor: PropTypes.func,
	xScale: PropTypes.func,
	interactive: PropTypes.object,
	width: PropTypes.number,
	stroke: PropTypes.string,
	opacity: PropTypes.number,
	fontStroke: PropTypes.string,
	onStart: PropTypes.func,
	onComplete: PropTypes.func,
	type: PropTypes.oneOf([
		"EXTEND", // extends from -Infinity to +Infinity
		"BOUND", // extends between the set bounds
	]).isRequired,
};

FibonacciRetracement.defaultProps = {
	snap: true,
	enabled: true,
	stroke: "#000000",
	opacity: 0.4,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 10,
	fontStroke: "#000000",
	type: "EXTEND",

};

export default makeInteractive(FibonacciRetracement, { retracements: [] });
