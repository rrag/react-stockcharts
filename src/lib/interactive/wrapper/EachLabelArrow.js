import React, { Component } from "react";
import PropTypes from "prop-types";

import { noop } from "../../utils";
import { saveNodeType, isHover } from "../utils";
import { getXValue, getCurrentItem } from "../../utils/ChartDataUtil";

import HoverTextNearMouse from "../components/HoverTextNearMouse";
import ClickableCircle from "../components/ClickableCircle";
import LabelArrow from "../components/LabelArrow";

class EachLabelArrow extends Component {
	constructor(props) {
		super(props);

		this.handleHover = this.handleHover.bind(this);

		this.handleDragStart = this.handleDragStart.bind(this);
		this.handleDrag = this.handleDrag.bind(this);
		this.handleEdge1Drag = this.handleEdge1Drag.bind(this);
		this.handleEdge1DragStart = this.handleEdge1DragStart.bind(this);
		this.handleDragComplete = this.handleDragComplete.bind(this);

		this.isHover = isHover.bind(this);
		this.saveNodeType = saveNodeType.bind(this);
		this.nodes = {};

		this.state = {
			hover: false,
		};
	}
	handleDragStart(moreProps) {
		const {
			position,
		} = this.props;
		const { mouseXY } = moreProps;
		const { chartConfig: { yScale }, xScale } = moreProps;
		const [mouseX, mouseY] = mouseXY;

		const [textCX, textCY] = position;
		const dx = mouseX - xScale(textCX);
		const dy = mouseY - yScale(textCY);

		this.dragStartPosition = {
			position, dx, dy
		};
	}
	handleDrag(moreProps) {
		const { index, onDrag } = this.props;
		const {
			mouseXY: [, mouseY],
			chartConfig: { yScale },
			xAccessor,
			mouseXY,
			plotData,
			xScale,
		} = moreProps;

		const { dx, dy } = this.dragStartPosition;
		const xValue = xScale.invert(
			xScale(getXValue(xScale, xAccessor, mouseXY, plotData)) - dx
		);
		// xScale.invert(xScale(xAccessor(currentItem)) - dx);
		const xyValue = [
			xValue,
			yScale.invert(mouseY - dy)
		];

		onDrag(index, xyValue);
	}
	handleHover(moreProps) {
		if (this.state.hover !== moreProps.hovering) {
			this.setState({
				hover: moreProps.hovering,
			});
		}
	}
	handleDragComplete(...rest) {
		this.setState({
			anchor: undefined
		});
		this.props.onDragComplete(...rest);
	}
	handleEdge1Drag(moreProps) {
		const { index, onDrag } = this.props;
		const {
			mouseXY: [, mouseY],
			chartConfig: { yScale },
			xAccessor,
			mouseXY,
			plotData,
			xScale,
		} = moreProps;

		const { dx, dy } = this.dragStartPosition;
		const xValue = xScale.invert(
			xScale(getXValue(xScale, xAccessor, mouseXY, plotData)) - dx
		);
		// xScale.invert(xScale(xAccessor(currentItem)) - dx);
		const xyValue = [
			xValue,
			yScale.invert(mouseY - dy)
		];

		onDrag(index, xyValue);
	}
	handleEdge1DragStart(moreProps) {
		const {
			position,
		} = this.props;
		const { mouseXY } = moreProps;
		const { chartConfig: { yScale }, xScale } = moreProps;
		const [mouseX, mouseY] = mouseXY;

		const [textCX, textCY] = position;
		const dx = mouseX - xScale(textCX);
		const dy = mouseY - yScale(textCY);
		this.dragStartPosition = {
			position, dx, dy
		};
		this.setState({
			anchor: "edge2"
		});
	}
	render() {
		const {
			type,
			position,
			hoverText,
			selected,
			onDragComplete,

			r,
			edgeStrokeWidth,
			edgeFill,
			edgeStroke,
			edgeInteractiveCursor,
			stroke,
			fill,
			width,
			id,
		} = this.props;
		const { hover, anchor } = this.state;

		const hoverHandler = {
			onHover: this.handleHover,
			onUnHover: this.handleHover
		};

		const {
			enable: hoverTextEnabled,
			selectedText: hoverTextSelected,
			text: hoverTextUnselected,
			...restHoverTextProps
		} = hoverText;

		return <g>
			<ClickableCircle
				ref={this.saveNodeType("edge1")}
				show={selected || hover}
				cx={position[0]}
				cy={position[1]}
				r={r}
				fill={edgeFill}
				stroke={anchor === "edge1" ? stroke : edgeStroke}
				strokeWidth={edgeStrokeWidth}
				strokeOpacity={1}
				interactiveCursorClass={edgeInteractiveCursor}
				onDragStart={this.handleEdge1DragStart}
				onDrag={this.handleEdge1Drag}
				onDragComplete={this.handleDragComplete} />
			<LabelArrow
				id={id}
				ref={this.saveNodeType("labelarrow")}
				type={type}
				fill={fill}
				width={width}
				onHover={this.handleHover}
				onUnHover={this.handleHover}
				selected={selected || hover}
				interactiveCursorClass="react-stockcharts-move-cursor"
				{...hoverHandler}

				onDragStart={this.handleDragStart}
				onDrag={this.handleDrag}
				onDragComplete={onDragComplete}
				position={position}
			/>
			<HoverTextNearMouse
				show={hoverTextEnabled && hover}
				{...restHoverTextProps}
				text={selected ? hoverTextSelected : hoverTextUnselected}
			/>
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

EachLabelArrow.propTypes = {
	index: PropTypes.number,

	position: PropTypes.array.isRequired,

	selected: PropTypes.bool.isRequired,

	onDrag: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,
	fill: PropTypes.string.isRequired,
	width: PropTypes.number.isRequired,

	hoverText: PropTypes.object.isRequired,
	type: PropTypes.oneOf(["OPEN", "CLOSE"]).isRequired,
};

EachLabelArrow.defaultProps = {
	edgeStroke: "#000000",
	edgeFill: "#FFFFFF",
	edgeStrokeWidth: 2,
	r: 5,
	strokeWidth: 1,
	strokeOpacity: 1,
	strokeDasharray: "Solid",

	onDrag: noop,
	onDragComplete: noop,
	selected: false,
	width: 40,
	type: "OPEN",
	width: 40,
	fill: "green",
	hoverText: {
		...HoverTextNearMouse.defaultProps,
	}
};

export default EachLabelArrow;
