"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, isNotDefined, noop } from "../utils";
import {
	terminate,
	saveNodeList,
	handleClickInteractiveType,
} from "./utils";
import EachFibRetracement from "./hoc/EachFibRetracement";
import MouseLocationIndicator from "./components/MouseLocationIndicator";
import HoverTextNearMouse from "./components/HoverTextNearMouse";
import GenericChartComponent from "../GenericChartComponent";
import { getMouseCanvas } from "../GenericComponent";

class FibonacciRetracement extends Component {
	constructor(props) {
		super(props);

		this.handleStart = this.handleStart.bind(this);
		this.handleEnd = this.handleEnd.bind(this);
		this.handleDrawRetracement = this.handleDrawRetracement.bind(this);

		this.handleEdge1Drag = this.handleEdge1Drag.bind(this);
		this.handleEdge2Drag = this.handleEdge2Drag.bind(this);

		this.handleDrag = this.handleDrag.bind(this);
		this.handleDragComplete = this.handleDragComplete.bind(this);

		this.terminate = terminate.bind(this);
		this.handleClick = handleClickInteractiveType("retracements").bind(this);
		this.saveNodeList = saveNodeList.bind(this);

		this.nodes = [];
		this.state = {
			retracements: []
		};
	}
	componentWillMount() {
		this.updateInteractiveToState(this.props.retracements);
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.retracements !== nextProps.retracements) {
			this.updateInteractiveToState(nextProps.retracements);
		}
	}
	updateInteractiveToState(retracements) {
		this.setState({
			retracements: retracements.map(t => {
				return {
					...t,
					selected: !!t.selected
				};
			}),
		});
	}
	handleStart(xyValue) {
		const { current } = this.state;
		if (isNotDefined(current) || isNotDefined(current.x1)) {
			this.mouseMoved = false;
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
		}
	}
	handleEnd(xyValue, moreProps, e) {
		const { retracements, current } = this.state;

		if (this.mouseMoved
			&& isDefined(current)
			&& isDefined(current.x1)
		) {
			const newRetracements = retracements
				.concat({
					...current,
					x2: xyValue[0],
					y2: xyValue[1],
					selected: true,
				});

			this.setState({
				current: null,
				retracements: newRetracements,
			}, () => {
				this.props.onComplete(newRetracements, moreProps, e);
			});
		}
	}
	handleDrawRetracement(xyValue) {
		const { current } = this.state;
		if (isDefined(current) && isDefined(current.x1)) {
			this.mouseMoved = true;
			this.setState({
				current: {
					...current,
					x2: xyValue[0],
					y2: xyValue[1],
				}
			});
		}
	}
	handleDrag(index, xy) {
		this.setState({
			override: {
				index,
				...xy
			}
		});
	}
	handleEdge1Drag(echo, newXYValue, origXYValue) {
		const { retracements } = this.state;
		const { index } = echo;

		const dx = origXYValue.x1Value - newXYValue.x1Value;

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
		const { retracements } = this.state;
		const { index } = echo;

		const dx = origXYValue.x2Value - newXYValue.x2Value;

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
	handleDragComplete(moreProps) {
		const { retracements, override } = this.state;
		if (isDefined(override)) {
			const { index, ...rest } = override;

			const newRetracements = retracements
				.map((each, idx) => idx === index
					? { ...rest, selected: true }
					: each);
			this.setState({
				override: null,
				retracements: newRetracements,
			}, () => {
				this.props.onComplete(newRetracements, moreProps);
			});
		}
	}
	render() {
		const { current, override, retracements } = this.state;

		const { stroke, strokeWidth, opacity, fontFamily, fontSize, fontStroke, type } = this.props;
		const {
			currentPositionStroke,
			currentPositionOpacity,
			currentPositionStrokeWidth,
			currentPositionRadius,
		} = this.props;

		const { enabled, hoverText } = this.props;
		const overrideIndex = isDefined(override) ? override.index : null;

		const currentRetracement = isDefined(current) && isDefined(current.x2)
			? <EachFibRetracement
				interactive={false}
				type={type}
				stroke={stroke}
				strokeWidth={strokeWidth}
				opacity={opacity}
				fontFamily={fontFamily}
				fontSize={fontSize}
				fontStroke={fontStroke}
				hoverText={hoverText}
				{...current}
			/>
			: null;
		return <g>
			{retracements.map((each, idx) => {
				return <EachFibRetracement key={idx}
					ref={this.saveNodeList}
					index={idx}
					type={type}
					selected={each.selected}
					stroke={stroke}
					strokeWidth={strokeWidth}
					opacity={opacity}
					fontFamily={fontFamily}
					fontSize={fontSize}
					fontStroke={fontStroke}
					hoverText={hoverText}
					{...(idx === overrideIndex ? override : each)}
					onDrag={this.handleDrag}
					onDragComplete={this.handleDragComplete}
				/>;
			})}
			{currentRetracement}
			<MouseLocationIndicator
				enabled={enabled}
				snap={false}
				r={currentPositionRadius}
				stroke={currentPositionStroke}
				opacity={currentPositionOpacity}
				strokeWidth={currentPositionStrokeWidth}
				onMouseDown={this.handleStart}
				onClick={this.handleEnd}
				onMouseMove={this.handleDrawRetracement}
			/>
			<GenericChartComponent

				svgDraw={noop}
				canvasToDraw={getMouseCanvas}
				canvasDraw={noop}

				onClick={this.handleClick}

				drawOn={["mousemove", "pan", "drag"]}
			/>
		</g>;
	}
}

FibonacciRetracement.propTypes = {
	enabled: PropTypes.bool.isRequired,
	fontFamily: PropTypes.string.isRequired,
	fontSize: PropTypes.number.isRequired,
	fontStroke: PropTypes.string,
	chartCanvasType: PropTypes.string,
	width: PropTypes.number,
	strokeWidth: PropTypes.number,
	stroke: PropTypes.string,
	opacity: PropTypes.number,

	onStart: PropTypes.func,
	onComplete: PropTypes.func,
	onSelect: PropTypes.func,

	type: PropTypes.oneOf([
		"EXTEND", // extends from -Infinity to +Infinity
		"BOUND", // extends between the set bounds
	]).isRequired,
	hoverText: PropTypes.object.isRequired,

	currentPositionStroke: PropTypes.string,
	currentPositionStrokeWidth: PropTypes.number,
	currentPositionOpacity: PropTypes.number,
	currentPositionRadius: PropTypes.number,

	childProps: PropTypes.any,
	retracements: PropTypes.array.isRequired,
};

FibonacciRetracement.defaultProps = {
	enabled: true,
	stroke: "#000000",
	strokeWidth: 1,
	opacity: .9,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 10,
	fontStroke: "#000000",
	type: "EXTEND",
	retracements: [],

	onStart: noop,
	onComplete: noop,
	onSelect: noop,

	hoverText: {
		...HoverTextNearMouse.defaultProps,
		enable: true,
		bgHeight: 18,
		bgWidth: 120,
		text: "Click to select object",
	},
	currentPositionStroke: "#000000",
	currentPositionOpacity: 1,
	currentPositionStrokeWidth: 3,
	currentPositionRadius: 4,

};

export default FibonacciRetracement;
