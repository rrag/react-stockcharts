import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../GenericChartComponent";

import { isDefined, getClosestValue, noop, shallowEqual, functor } from "../utils";
// import { getCurrentCharts } from "../utils/ChartDataUtil";

class MouseLocationIndicator extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);

		this.handleMousePosChange = this.handleMousePosChange.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.xy = this.xy.bind(this);
		this.saveNode = this.saveNode.bind(this);

		this.mutableState = {};
	}
	saveNode(node) {
		this.node = node;
	}
	handleMouseDown(e) {
		var moreProps = this.node.getMoreProps();
		var pos = this.xy(moreProps, e);
		if (isDefined(pos)) {
			var { xValue, yValue, x, y } = pos;
			this.mutableState = { x, y };
			this.props.onMouseDown([xValue, yValue], e);
		}
	}
	handleClick(e) {
		var moreProps = this.node.getMoreProps();
		var pos = this.xy(moreProps, e);
		if (isDefined(pos)) {
			var { xValue, yValue, x, y } = pos;
			this.mutableState = { x, y };
			this.props.onClick([xValue, yValue], e);
		}
	}
	xy(moreProps, e) {
		var { xAccessor } = moreProps;
		var { mouseXY, currentItem, xScale, chartConfig: { yScale } } = moreProps;
		var { enabled, snap, shouldDisableSnap, snapTo } = this.props;

		if (enabled && isDefined(currentItem) && isDefined(e)) {

			var xValue = xAccessor(currentItem);
			var yValue = snap && !shouldDisableSnap(e)
				? getClosestValue(snapTo(currentItem), yScale.invert(mouseXY[1]))
				: yScale.invert(mouseXY[1]);

			var x = xScale(xValue);
			var y = yScale(yValue);

			return { xValue, yValue, x, y };
		}
	}
	handleMousePosChange(e) {
		// var { idx, onMouseEnter } = this.props;
		var moreProps = this.node.getMoreProps();
		// var prevMoreProps = this.node.getPrevMoreProps();

		if (!shallowEqual(moreProps.mousXY, this.node.prevMouseXY)) {
			var pos = this.xy(moreProps, e);
			// console.log("HERE11", pos)
			if (isDefined(pos)) {
				var { xValue, yValue, x, y } = pos;
				this.mutableState = { x, y };
				this.props.onMouseMove([xValue, yValue], e);
			}
		}
		// console.log(this.node.getRef("capture"))
	}
	renderSVG(moreProps) {
		var { enabled, r, stroke, strokeWidth, opacity } = this.props;
		var { x, y } = this.mutableState;
		var { show } = moreProps;
		// console.log("HERE")

		// console.log(stroke, strokeWidth, opacity)
		return enabled && show && isDefined(x)
			? <circle ref="capture"
				className="react-stockcharts-avoid-interaction"
				cx={x}
				cy={y}
				r={r}
				stroke={stroke}
				opacity={opacity}
				fill="none"
				strokeWidth={strokeWidth} />
			: null;

	}
	render() {
		return <GenericChartComponent ref={this.saveNode}
			svgDraw={this.renderSVG}
			onMouseMove={this.handleMousePosChange}
			isHover={functor(true)}
			onMouseDown={this.handleMouseDown}
			onClick={this.handleClick}
			onContextMenu={this.handleContextMenu}
			drawOnMouseExitOfCanvas
			/>;
	}
}

MouseLocationIndicator.propTypes = {
	enabled: PropTypes.bool.isRequired,
	snap: PropTypes.bool.isRequired,
	shouldDisableSnap: PropTypes.func.isRequired,
	snapTo: PropTypes.func,

	onMouseMove: PropTypes.func.isRequired,
	onMouseDown: PropTypes.func.isRequired,
	onClick: PropTypes.func.isRequired,
	r: PropTypes.number.isRequired,
	stroke: PropTypes.string.isRequired,
	strokeWidth: PropTypes.number.isRequired,
	opacity: PropTypes.number.isRequired,
};

MouseLocationIndicator.defaultProps = {
	onMouseMove: noop,
	onMouseDown: noop,
	onClick: noop,
	shouldDisableSnap: functor(false),
	stroke: "#000000",
	strokeWidth: 1,
	opacity: 1,
};

export default MouseLocationIndicator;