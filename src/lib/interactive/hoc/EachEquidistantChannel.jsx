import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, noop } from "../../utils";
import { getCurrentItem } from "../../utils/ChartDataUtil";

import ClickableCircle from "../components/ClickableCircle";
import ChannelWithArea from "../components/ChannelWithArea";
import HoverTextNearMouse from "../components/HoverTextNearMouse";

class EachEquidistantChannel extends Component {
	constructor(props) {
		super(props);

		this.handleLine1Edge1Drag = this.handleLine1Edge1Drag.bind(this);
		this.handleLine1Edge2Drag = this.handleLine1Edge2Drag.bind(this);

		this.handleDragStart = this.handleDragStart.bind(this);
		this.handleChannelDrag = this.handleChannelDrag.bind(this);
		this.handleDragComplete = this.handleDragComplete.bind(this);

		this.handleChannelHeightChange = this.handleChannelHeightChange.bind(this);

		this.handleHover = this.handleHover.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.handleUnSelect = this.handleUnSelect.bind(this);

		this.getEdgeCircle = this.getEdgeCircle.bind(this);

		this.state = {
			selected: false,
			hover: false,
		};
	}
	handleHover(moreProps) {
		if (this.state.hover !== moreProps.hovering) {
			this.setState({
				hover: moreProps.hovering
			});
		}
	}
	handleSelect() {
		if (!this.state.selected) {
			this.setState({
				selected: true
			});
		}
	}
	handleUnSelect() {
		if (this.state.selected) {
			this.setState({
				selected: false
			});
		}
	}
	handleDragStart() {
		const {
			startXY, endXY, dy,
		} = this.props;

		this.dragStart = {
			startXY, endXY, dy,
		};
	}
	handleChannelDrag(moreProps) {
		const { index, onDrag } = this.props;

		const {
			startXY, endXY,
		} = this.dragStart;

		const { xScale, chartConfig: { yScale }, xAccessor, fullData } = moreProps;
		const { startPos, mouseXY } = moreProps;

		const x1 = xScale(startXY[0]);
		const y1 = yScale(startXY[1]);
		const x2 = xScale(endXY[0]);
		const y2 = yScale(endXY[1]);

		const dx = startPos[0] - mouseXY[0];
		const dy = startPos[1] - mouseXY[1];

		const newX1Value = xAccessor(getCurrentItem(xScale, xAccessor, [x1 - dx, y1 - dy], fullData));
		const newY1Value = yScale.invert(y1 - dy);
		const newX2Value = xAccessor(getCurrentItem(xScale, xAccessor, [x2 - dx, y2 - dy], fullData));
		const newY2Value = yScale.invert(y2 - dy);

		// const newDy = newY2Value - endXY[1] + this.dragStart.dy;

		onDrag(index, {
			startXY: [newX1Value, newY1Value],
			endXY: [newX2Value, newY2Value],
			dy: this.dragStart.dy,
		});
	}
	handleLine1Edge1Drag(moreProps) {
		const { index, onDrag } = this.props;
		const {
			startXY,
		} = this.dragStart;

		const {
			startPos, mouseXY, xAccessor,
			xScale, fullData,
			chartConfig: { yScale }
		} = moreProps;

		const dx = startPos[0] - mouseXY[0];
		const dy = startPos[1] - mouseXY[1];

		const x1 = xScale(startXY[0]);
		const y1 = yScale(startXY[1]);

		const newX1Value = xAccessor(getCurrentItem(xScale, xAccessor, [x1 - dx, y1 - dy], fullData));
		const newY1Value = yScale.invert(y1 - dy);

		onDrag(index, {
			startXY: [newX1Value, newY1Value],
			endXY: this.dragStart.endXY,
			dy: this.dragStart.dy,
		});
	}
	handleLine1Edge2Drag(moreProps) {
		const { index, onDrag } = this.props;
		const {
			endXY,
		} = this.dragStart;

		const {
			startPos, mouseXY, xAccessor,
			xScale, fullData,
			chartConfig: { yScale }
		} = moreProps;

		const dx = startPos[0] - mouseXY[0];
		const dy = startPos[1] - mouseXY[1];

		const x1 = xScale(endXY[0]);
		const y1 = yScale(endXY[1]);

		const newX1Value = xAccessor(getCurrentItem(xScale, xAccessor, [x1 - dx, y1 - dy], fullData));
		const newY1Value = yScale.invert(y1 - dy);

		onDrag(index, {
			startXY: this.dragStart.startXY,
			endXY: [newX1Value, newY1Value],
			dy: this.dragStart.dy,
		});
	}
	handleChannelHeightChange(moreProps) {
		const { index, onDrag } = this.props;

		const {
			startXY, endXY,
		} = this.dragStart;

		const { chartConfig: { yScale } } = moreProps;
		const { startPos, mouseXY } = moreProps;

		const y2 = yScale(endXY[1]);

		const dy = startPos[1] - mouseXY[1];

		const newY2Value = yScale.invert(y2 - dy);

		const newDy = newY2Value - endXY[1] + this.dragStart.dy;

		onDrag(index, {
			startXY,
			endXY,
			dy: newDy,
		});
	}
	handleDragComplete() {
		const { onDragComplete } = this.props;
		onDragComplete();
	}
	getEdgeCircle({ xy, dragHandler, cursor, fill }) {
		const { selected } = this.state;
		const { edgeStroke, edgeStrokeWidth, r } = this.props;

		return <ClickableCircle
			show={selected}
			cx={xy[0]}
			cy={xy[1]}
			r={r}
			fill={fill}
			stroke={edgeStroke}
			strokeWidth={edgeStrokeWidth}
			opacity={1}
			interactiveCursorClass={cursor}

			onDragStart={this.handleDragStart}
			onDrag={dragHandler}
			onDragComplete={this.handleDragComplete} />;
	}
	render() {
		const { startXY, endXY, dy } = this.props;
		const { interactive, edgeFill } = this.props;
		const { stroke, strokeWidth, fill, opacity } = this.props;
		const { selected, hover } = this.state;

		const hoverHandler = interactive
			? { onHover: this.handleHover, onBlur: this.handleHover }
			: {};

		const line1Edge = isDefined(startXY) && isDefined(endXY)
			? <g>
				{this.getEdgeCircle({
					xy: startXY,
					dragHandler: this.handleLine1Edge1Drag,
					cursor: "react-stockcharts-move-cursor",
					fill: edgeFill
				})}
				{this.getEdgeCircle({
					xy: endXY,
					dragHandler: this.handleLine1Edge2Drag,
					cursor: "react-stockcharts-move-cursor",
					fill: edgeFill
				})}
			</g>
			: null;
		const line2Edge = isDefined(dy)
			? <g>
				{this.getEdgeCircle({
					xy: [startXY[0], startXY[1] + dy],
					dragHandler: this.handleChannelHeightChange,
					cursor: "react-stockcharts-ns-resize-cursor",
					fill: "#250B98"
				})}
				{this.getEdgeCircle({
					xy: [endXY[0], endXY[1] + dy],
					dragHandler: this.handleChannelHeightChange,
					cursor: "react-stockcharts-ns-resize-cursor",
					fill: "#250B98"
				})}
			</g>
			: null;

		return <g>
			<ChannelWithArea
				selected={selected}

				{...hoverHandler}
				onClick={this.handleSelect}
				onClickOutside={this.handleUnSelect}

				startXY={startXY}
				endXY={endXY}
				dy={dy}
				stroke={stroke}
				strokeWidth={(hover || selected) ? strokeWidth + 1 : strokeWidth}
				fill={fill}
				opacity={opacity}
				interactiveCursorClass="react-stockcharts-move-cursor"

				onDragStart={this.handleDragStart}
				onDrag={this.handleChannelDrag}
				onDragComplete={this.handleDragComplete}
				/>
			{line1Edge}
			{line2Edge}
			<HoverTextNearMouse show={hover && !selected}
				bgHeight={18}
				bgWidth={120}
				children="Click to select object" />
		</g>;
	}
}

EachEquidistantChannel.propTypes = {
	startXY: PropTypes.arrayOf(PropTypes.number).isRequired,
	endXY: PropTypes.arrayOf(PropTypes.number).isRequired,
	dy: PropTypes.number,

	stroke: PropTypes.string.isRequired,
	strokeWidth: PropTypes.number.isRequired,
	fill: PropTypes.string.isRequired,
	opacity: PropTypes.number.isRequired,

	interactive: PropTypes.bool.isRequired,

	r: PropTypes.number.isRequired,
	edgeFill: PropTypes.string.isRequired,
	edgeStroke: PropTypes.string.isRequired,
	edgeStrokeWidth: PropTypes.number.isRequired,

	index: PropTypes.number,
	onDrag: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,
};

EachEquidistantChannel.defaultProps = {
	yDisplayFormat: d => d.toFixed(2),
	interactive: true,
	edgeStroke: "#000000",
	edgeFill: "#FFFFFF",
	edgeStrokeWidth: 1,
	r: 5,
	onDrag: noop,
	onDragComplete: noop,
};

export default EachEquidistantChannel;