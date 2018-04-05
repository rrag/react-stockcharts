import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, noop } from "../../utils";
import { getXValue } from "../../utils/ChartDataUtil";
import { saveNodeType, isHover } from "../utils";

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

		this.handleChannelHeightChange = this.handleChannelHeightChange.bind(this);

		this.getEdgeCircle = this.getEdgeCircle.bind(this);
		this.handleHover = this.handleHover.bind(this);

		this.isHover = isHover.bind(this);
		this.saveNodeType = saveNodeType.bind(this);
		this.nodes = {};

		this.state = {
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

		const newX1Value = getXValue(xScale, xAccessor, [x1 - dx, y1 - dy], fullData);
		const newY1Value = yScale.invert(y1 - dy);
		const newX2Value = getXValue(xScale, xAccessor, [x2 - dx, y2 - dy], fullData);
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

		const newX1Value = getXValue(xScale, xAccessor, [x1 - dx, y1 - dy], fullData);
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

		const newX1Value = getXValue(xScale, xAccessor, [x1 - dx, y1 - dy], fullData);
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
	getEdgeCircle({ xy, dragHandler, cursor, fill, edge }) {
		const { hover } = this.state;
		const { appearance } = this.props;
		const { edgeStroke, edgeStrokeWidth, r } = appearance;
		const { selected } = this.props;
		const { onDragComplete } = this.props;

		return <ClickableCircle
			ref={this.saveNodeType(edge)}

			show={selected || hover}
			cx={xy[0]}
			cy={xy[1]}
			r={r}
			fill={fill}
			stroke={edgeStroke}
			strokeWidth={edgeStrokeWidth}
			interactiveCursorClass={cursor}

			onDragStart={this.handleDragStart}
			onDrag={dragHandler}
			onDragComplete={onDragComplete} />;
	}
	render() {
		const { startXY, endXY, dy } = this.props;
		const { interactive, hoverText, appearance } = this.props;
		const {
			edgeFill, edgeFill2,
			stroke, strokeWidth, strokeOpacity,
			fill, fillOpacity,
		} = appearance;
		const { selected } = this.props;
		const { onDragComplete } = this.props;
		const { hover } = this.state;
		const { enable: hoverTextEnabled, ...restHoverTextProps } = hoverText;

		const hoverHandler = interactive
			? { onHover: this.handleHover, onUnHover: this.handleHover }
			: {};

		const line1Edge = isDefined(startXY) && isDefined(endXY)
			? <g>
				{this.getEdgeCircle({
					xy: startXY,
					dragHandler: this.handleLine1Edge1Drag,
					cursor: "react-stockcharts-move-cursor",
					fill: edgeFill,
					edge: "line1edge1",
				})}
				{this.getEdgeCircle({
					xy: endXY,
					dragHandler: this.handleLine1Edge2Drag,
					cursor: "react-stockcharts-move-cursor",
					fill: edgeFill,
					edge: "line1edge2",
				})}
			</g>
			: null;
		const line2Edge = isDefined(dy)
			? <g>
				{this.getEdgeCircle({
					xy: [startXY[0], startXY[1] + dy],
					dragHandler: this.handleChannelHeightChange,
					cursor: "react-stockcharts-ns-resize-cursor",
					fill: edgeFill2,
					edge: "line2edge1",
				})}
				{this.getEdgeCircle({
					xy: [endXY[0], endXY[1] + dy],
					dragHandler: this.handleChannelHeightChange,
					cursor: "react-stockcharts-ns-resize-cursor",
					fill: edgeFill2,
					edge: "line2edge2",
				})}
			</g>
			: null;

		return <g>
			<ChannelWithArea
				ref={this.saveNodeType("channel")}
				selected={selected || hover}

				{...hoverHandler}

				startXY={startXY}
				endXY={endXY}
				dy={dy}
				stroke={stroke}
				strokeWidth={(hover || selected) ? strokeWidth + 1 : strokeWidth}
				strokeOpacity={strokeOpacity}
				fill={fill}
				fillOpacity={fillOpacity}
				interactiveCursorClass="react-stockcharts-move-cursor"

				onDragStart={this.handleDragStart}
				onDrag={this.handleChannelDrag}
				onDragComplete={onDragComplete}
			/>
			{line1Edge}
			{line2Edge}
			<HoverTextNearMouse
				show={hoverTextEnabled && hover && !selected}
				{...restHoverTextProps} />
		</g>;
	}
}

EachEquidistantChannel.propTypes = {
	startXY: PropTypes.arrayOf(PropTypes.number).isRequired,
	endXY: PropTypes.arrayOf(PropTypes.number).isRequired,
	dy: PropTypes.number,

	interactive: PropTypes.bool.isRequired,
	selected: PropTypes.bool.isRequired,
	hoverText: PropTypes.object.isRequired,

	appearance: PropTypes.shape({
		stroke: PropTypes.string.isRequired,
		fillOpacity: PropTypes.number.isRequired,
		strokeOpacity: PropTypes.number.isRequired,
		strokeWidth: PropTypes.number.isRequired,
		fill: PropTypes.string.isRequired,
		edgeStroke: PropTypes.string.isRequired,
		edgeFill: PropTypes.string.isRequired,
		edgeFill2: PropTypes.string.isRequired,
		edgeStrokeWidth: PropTypes.number.isRequired,
		r: PropTypes.number.isRequired,
	}).isRequired,

	index: PropTypes.number,
	onDrag: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,
};

EachEquidistantChannel.defaultProps = {
	yDisplayFormat: d => d.toFixed(2),
	interactive: true,
	selected: false,

	onDrag: noop,
	onDragComplete: noop,
	hoverText: {
		enable: false,
	}
};

export default EachEquidistantChannel;