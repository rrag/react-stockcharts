import React, { Component } from "react";
import PropTypes from "prop-types";

import { noop } from "../../utils";
import { getCurrentItem } from "../../utils/ChartDataUtil";
import { saveNodeType, isHover } from "../utils";

import HoverTextNearMouse from "../components/HoverTextNearMouse";
import {
	default as LinearRegressionChannelWithArea,
	edge1Provider,
	edge2Provider
} from "../components/LinearRegressionChannelWithArea";

import ClickableCircle from "../components/ClickableCircle";

class EachLinearRegressionChannel extends Component {
	constructor(props) {
		super(props);

		this.handleEdge1Drag = this.handleEdge1Drag.bind(this);
		this.handleEdge2Drag = this.handleEdge2Drag.bind(this);

		this.handleHover = this.handleHover.bind(this);

		this.isHover = isHover.bind(this);
		this.saveNodeType = saveNodeType.bind(this);
		this.nodes = {};

		this.state = {
			hover: false,
		};
	}
	handleEdge1Drag(moreProps) {
		const { index, onDrag, snapTo } = this.props;
		const {
			x2Value,
		} = this.props;

		const [x1Value] = getNewXY(moreProps, snapTo);

		onDrag(index, {
			x1Value,
			x2Value,
		});
	}
	handleEdge2Drag(moreProps) {
		const { index, onDrag, snapTo } = this.props;
		const {
			x1Value,
		} = this.props;

		const [x2Value] = getNewXY(moreProps, snapTo);

		onDrag(index, {
			x1Value,
			x2Value,
		});
	}
	handleHover(moreProps) {
		if (this.state.hover !== moreProps.hovering) {
			this.setState({
				hover: moreProps.hovering
			});
		}
	}
	render() {
		const {
			x1Value,
			x2Value,
			appearance,
			edgeInteractiveCursor,
			hoverText,
			interactive,
			selected,
			onDragComplete,
		} = this.props;
		const {
			stroke,
			strokeWidth,
			strokeOpacity,
			fill,
			fillOpacity,
			r,
			edgeStrokeWidth,
			edgeFill,
			edgeStroke,
		} = appearance;
		const { hover } = this.state;

		const hoverHandler = interactive
			? { onHover: this.handleHover, onUnHover: this.handleHover }
			: {};
		const { enable: hoverTextEnabled, ...restHoverTextProps } = hoverText;

		// console.log("SELECTED ->", selected);
		return <g>
			<LinearRegressionChannelWithArea
				ref={this.saveNodeType("area")}
				selected={selected || hover}
				{...hoverHandler}

				x1Value={x1Value}
				x2Value={x2Value}
				fill={fill}
				stroke={stroke}
				strokeWidth={(hover || selected) ? strokeWidth + 1 : strokeWidth}
				strokeOpacity={strokeOpacity}
				fillOpacity={fillOpacity} />
			<ClickableCircle
				ref={this.saveNodeType("edge1")}
				show={selected || hover}
				xyProvider={edge1Provider(this.props)}
				r={r}
				fill={edgeFill}
				stroke={edgeStroke}
				strokeWidth={edgeStrokeWidth}
				interactiveCursorClass={edgeInteractiveCursor}
				onDrag={this.handleEdge1Drag}
				onDragComplete={onDragComplete} />
			<ClickableCircle
				ref={this.saveNodeType("edge2")}
				show={selected || hover}
				xyProvider={edge2Provider(this.props)}
				r={r}
				fill={edgeFill}
				stroke={edgeStroke}
				strokeWidth={edgeStrokeWidth}
				interactiveCursorClass={edgeInteractiveCursor}
				onDrag={this.handleEdge2Drag}
				onDragComplete={onDragComplete} />
			<HoverTextNearMouse
				show={hoverTextEnabled && hover && !selected}
				{...restHoverTextProps} />
		</g>;
	}
}

export function getNewXY(moreProps, snapTo) {
	const { xScale, xAccessor, plotData, mouseXY } = moreProps;

	const currentItem = getCurrentItem(xScale, xAccessor, mouseXY, plotData);
	const x = xAccessor(currentItem);
	const y = snapTo(currentItem);

	return [x, y];
}

EachLinearRegressionChannel.propTypes = {
	defaultClassName: PropTypes.string,

	x1Value: PropTypes.any.isRequired,
	x2Value: PropTypes.any.isRequired,

	index: PropTypes.number,

	appearance: PropTypes.shape({
		stroke: PropTypes.string.isRequired,
		fillOpacity: PropTypes.number.isRequired,
		strokeOpacity: PropTypes.number.isRequired,
		strokeWidth: PropTypes.number.isRequired,
		fill: PropTypes.string.isRequired,
		edgeStrokeWidth: PropTypes.number.isRequired,
		edgeStroke: PropTypes.string.isRequired,
		edgeFill: PropTypes.string.isRequired,
		r: PropTypes.number.isRequired,
	}).isRequired,

	edgeInteractiveCursor: PropTypes.string,
	onDrag: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,
	snapTo: PropTypes.func,
	interactive: PropTypes.bool.isRequired,
	selected: PropTypes.bool.isRequired,

	hoverText: PropTypes.object.isRequired,
};

EachLinearRegressionChannel.defaultProps = {
	onDrag: noop,
	onDragComplete: noop,

	appearance: {
		stroke: "#000000",
		fillOpacity: 0.7,
		strokeOpacity: 1,
		strokeWidth: 1,
		fill: "#8AAFE2",
		edgeStrokeWidth: 2,
		edgeStroke: "#000000",
		edgeFill: "#FFFFFF",
		r: 5,
	},
	interactive: true,
	selected: false,
	hoverText: {
		...HoverTextNearMouse.defaultProps,
		enable: true,
		bgHeight: 18,
		bgWidth: 175,
		text: "Click and drag the edge circles",
	}
};

export default EachLinearRegressionChannel;