import React, { PropTypes, Component } from "react";

import { noop } from "../utils";
import { getCurrentItem } from "../utils/ChartDataUtil";

import StraightLine from "./StraightLine";
import ClickableCircle from "./ClickableCircle";

class InteractiveLine extends Component {
	constructor(props) {
		super(props);
		this.handleSelect = this.handleSelect.bind(this);
		this.handleUnSelect = this.handleUnSelect.bind(this);
		this.handleEdge1Drag = this.handleEdge1Drag.bind(this);
		this.handleEdge1DragComplete = this.handleEdge1DragComplete.bind(this);
		this.handleEdge2Drag = this.handleEdge2Drag.bind(this);
		this.handleEdge2DragComplete = this.handleEdge2DragComplete.bind(this);
		this.handleLineDragStart = this.handleLineDragStart.bind(this);
		this.handleLineDrag = this.handleLineDrag.bind(this);
		this.handleLineComplete = this.handleLineComplete.bind(this);

		this.handleHover = this.handleHover.bind(this);

		this.state = {
			selected: false,
			hover: false,
		};
	}
	handleSelect() {
		this.setState({
			selected: !this.state.selected
		});
	}
	handleUnSelect() {
		if (this.state.selected) {
			this.setState({
				selected: false
			});
		}
	}
	handleLineDragStart() {
		const {
			x1Value, y1Value,
			x2Value, y2Value,
		} = this.props;

		this.dragStart = {
			x1Value, y1Value,
			x2Value, y2Value,
		};
	}
	handleLineDrag(moreProps) {
		const { onDrag } = this.props;

		const {
			x1Value, y1Value,
			x2Value, y2Value,
		} = this.dragStart;

		const { xScale, chartConfig: { yScale }, xAccessor, fullData } = moreProps;
		const { startPos, mouseXY } = moreProps;

		const x1 = xScale(x1Value);
		const y1 = yScale(y1Value);
		const x2 = xScale(x2Value);
		const y2 = yScale(y2Value);

		const dx = startPos[0] - mouseXY[0];
		const dy = startPos[1] - mouseXY[1];

		const newX1Value = xAccessor(getCurrentItem(xScale, xAccessor, [x1 - dx, y1 - dy], fullData));
		const newY1Value = yScale.invert(y1 - dy);
		const newX2Value = xAccessor(getCurrentItem(xScale, xAccessor, [x2 - dx, y2 - dy], fullData));
		const newY2Value = yScale.invert(y2 - dy);

		onDrag({
			x1Value: newX1Value,
			y1Value: newY1Value,
			x2Value: newX2Value,
			y2Value: newY2Value,
		});
	}
	handleLineComplete() {
		//
	}
	handleEdge1Drag(moreProps) {
		const { onDrag } = this.props;
		const {
			x2Value, y2Value,
		} = this.props;

		const [x1Value, y1Value] = getNewXY(moreProps);

		onDrag({
			x1Value,
			y1Value,
			x2Value,
			y2Value,
		});
	}
	handleEdge1DragComplete(moreProps) {
		const { onDragComplete } = this.props;
		const {
			x2Value, y2Value,
		} = this.props;

		const [x1Value, y1Value] = getNewXY(moreProps);

		onDragComplete({
			x1Value,
			y1Value,
			x2Value,
			y2Value,
		});
	}
	handleEdge2Drag(moreProps) {
		const { onDrag } = this.props;
		const {
			x1Value, y1Value,
		} = this.props;

		const [x2Value, y2Value] = getNewXY(moreProps);

		onDrag({
			x1Value,
			y1Value,
			x2Value,
			y2Value,
		});
	}
	handleEdge2DragComplete(moreProps) {
		const { onDragComplete } = this.props;
		const {
			x1Value, y1Value,
		} = this.props;

		const [x2Value, y2Value] = getNewXY(moreProps);

		onDragComplete({
			x1Value,
			y1Value,
			x2Value,
			y2Value,
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
			y1Value,
			x2Value,
			y2Value,
			type,
			stroke,
			strokeWidth,
			opacity,
			r,
			edgeStrokeWidth,
			edgeFill,
			edgeStroke,
			edgeInteractiveCursor,
			lineInteractiveCursor,
		} = this.props;
		const { selected, hover } = this.state;

		// console.log("SELECTED ->", selected);
		return <g>
			<StraightLine
				selected={selected}
				onHover={this.handleHover}
				onBlur={this.handleHover}
				onClick={this.handleSelect}
				onClickOutside={this.handleUnSelect}
				x1Value={x1Value}
				y1Value={y1Value}
				x2Value={x2Value}
				y2Value={y2Value}
				type={type}
				stroke={stroke}
				strokeWidth={(hover || selected) ? strokeWidth + 1 : strokeWidth}
				opacity={opacity}
				interactiveCursorClass={lineInteractiveCursor}
				onDragStart={this.handleLineDragStart}
				onDrag={this.handleLineDrag}
				onDragComplete={this.handleLineComplete} />
			<ClickableCircle
				show={selected}
				cx={x1Value}
				cy={y1Value}
				r={r}
				fill={edgeFill}
				stroke={edgeStroke}
				strokeWidth={edgeStrokeWidth}
				opacity={1}
				interactiveCursorClass={edgeInteractiveCursor}
				onDrag={this.handleEdge1Drag}
				onDragComplete={this.handleEdge1DragComplete} />
			<ClickableCircle
				show={selected}
				cx={x2Value}
				cy={y2Value}
				r={r}
				fill={edgeFill}
				stroke={edgeStroke}
				strokeWidth={edgeStrokeWidth}
				opacity={1}
				interactiveCursorClass={edgeInteractiveCursor}
				onDrag={this.handleEdge2Drag}
				onDragComplete={this.handleEdge2DragComplete} />
		</g>;
	}
}

export function getNewXY(moreProps) {
	const { xScale, chartConfig: { yScale }, xAccessor, plotData, mouseXY } = moreProps;
	const [, mouseY] = mouseXY;

	const currentItem = getCurrentItem(xScale, xAccessor, mouseXY, plotData);
	const x = xAccessor(currentItem);
	const [small, big] = yScale.domain().sort();
	const y = yScale.invert(mouseY);
	const newY = Math.min(Math.max(y, small), big);
	return [x, newY];
}

InteractiveLine.propTypes = {
	x1Value: PropTypes.any.isRequired,
	x2Value: PropTypes.any.isRequired,
	y1Value: PropTypes.any.isRequired,
	y2Value: PropTypes.any.isRequired,

	stroke: PropTypes.string.isRequired,
	strokeWidth: PropTypes.number.isRequired,
	type: PropTypes.oneOf([
		"XLINE", // extends from -Infinity to +Infinity
		"RAY", // extends to +/-Infinity in one direction
		"LINE", // extends between the set bounds
	]).isRequired,
	onDrag: PropTypes.func.isRequired,
	onEdge1Drag: PropTypes.func.isRequired,
	onEdge2Drag: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,
	r: PropTypes.number.isRequired,
	opacity: PropTypes.number.isRequired,
	defaultClassName: PropTypes.string,

	edgeStrokeWidth: PropTypes.number.isRequired,
	edgeStroke: PropTypes.string.isRequired,
	edgeInteractiveCursor: PropTypes.string.isRequired,
	lineInteractiveCursor: PropTypes.string.isRequired,
	edgeFill: PropTypes.string.isRequired,
};

InteractiveLine.defaultProps = {
	onDrag: noop,
	onEdge1Drag: noop,
	onEdge2Drag: noop,
	onDragComplete: noop,
	edgeStroke: "#000000",
	edgeFill: "#FFFFFF",
	edgeStrokeWidth: 2,
	r: 5,
	strokeWidth: 1,
	opacity: 1,
};

export default InteractiveLine;