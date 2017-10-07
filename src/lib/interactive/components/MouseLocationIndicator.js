import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../../GenericChartComponent";
import { getMouseCanvas } from "../../GenericComponent";

import { isDefined, getClosestValue, noop, shallowEqual, functor } from "../../utils";
import { getXValue } from "../../utils/ChartDataUtil";

class MouseLocationIndicator extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);

		this.handleMousePosChange = this.handleMousePosChange.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.xy = this.xy.bind(this);

		this.mutableState = {};
	}
	handleMouseDown(moreProps, e) {
		const pos = this.xy(moreProps, e);
		if (isDefined(pos)) {
			const { xValue, yValue, x, y } = pos;
			this.mutableState = { x, y };
			this.props.onMouseDown([xValue, yValue], moreProps, e);
		}
	}
	handleClick(moreProps, e) {
		const pos = this.xy(moreProps, e);
		if (isDefined(pos)) {
			const { xValue, yValue, x, y } = pos;
			this.mutableState = { x, y };
			this.props.onClick([xValue, yValue], moreProps, e);
		}
	}
	xy(moreProps, e) {
		const { xAccessor, plotData } = moreProps;
		const { mouseXY, currentItem, xScale, chartConfig: { yScale } } = moreProps;
		const { enabled, snap, shouldDisableSnap, snapTo } = this.props;

		if (enabled && isDefined(currentItem) && isDefined(e)) {
			const xValue =  snap && !shouldDisableSnap(e)
				? xAccessor(currentItem)
				: getXValue(xScale, xAccessor, mouseXY, plotData);
			const yValue = snap && !shouldDisableSnap(e)
				? getClosestValue(snapTo(currentItem), yScale.invert(mouseXY[1]))
				: yScale.invert(mouseXY[1]);

			const x = xScale(xValue);
			const y = yScale(yValue);

			return { xValue, yValue, x, y };
		}
	}
	handleMousePosChange(moreProps, e) {
		if (!shallowEqual(moreProps.mousXY, moreProps.prevMouseXY)) {
			const pos = this.xy(moreProps, e);
			if (isDefined(pos)) {
				const { xValue, yValue, x, y } = pos;
				this.mutableState = { x, y };
				this.props.onMouseMove([xValue, yValue], e);
			}
		}
	}
	drawOnCanvas(ctx, moreProps) {
		const { enabled, r, stroke, strokeWidth } = this.props;
		const { x, y } = this.mutableState;
		const { show } = moreProps;
		// console.log(show)
		if (enabled && show && isDefined(x)) {
			ctx.lineWidth = strokeWidth;
			ctx.strokeStyle = stroke;
			ctx.moveTo(x, y);
			ctx.beginPath();
			ctx.arc(x, y, r, 0, 2 * Math.PI, false);
			ctx.stroke();
			// ctx.fill();
		}
	}
	renderSVG(moreProps) {
		const { enabled, r, stroke, strokeWidth, opacity } = this.props;
		const { x, y } = this.mutableState;
		const { show } = moreProps;

		// console.log("HERE")
		// console.log(stroke, strokeWidth, opacity)

		return enabled && show && isDefined(x)
			? <circle
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
		const { enabled, disablePan } = this.props;
		return <GenericChartComponent
			onMouseDown={this.handleMouseDown}
			onClick={this.handleClick}
			onContextMenu={this.handleContextMenu}
			onMouseMove={this.handleMousePosChange}
			onPan={this.handleMousePosChange}

			disablePan={enabled && disablePan}

			svgDraw={this.renderSVG}

			canvasDraw={this.drawOnCanvas}
			canvasToDraw={getMouseCanvas}

			drawOn={["mousemove", "pan"]}
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
	disablePan: PropTypes.bool.isRequired,
};

MouseLocationIndicator.defaultProps = {
	onMouseMove: noop,
	onMouseDown: noop,
	onClick: noop,
	shouldDisableSnap: functor(false),
	stroke: "#000000",
	strokeWidth: 1,
	opacity: 1,
	disablePan: true,
};

export default MouseLocationIndicator;