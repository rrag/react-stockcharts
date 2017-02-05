import React, { PropTypes, Component } from "react";

import GenericChartComponent from "../GenericChartComponent";
import { getInteractiveCanvas } from "../GenericComponent";

import { isDefined, getClosestValue, noop, shallowEqual, functor } from "../utils";
// import { getCurrentCharts } from "../utils/ChartDataUtil";

class MouseLocationIndicator extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);

		this.handleMousePosChange = this.handleMousePosChange.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.xy = this.xy.bind(this);

		this.mutableState = {};
	}
	handleMouseDown(moreProps, e) {
		const pos = this.xy(moreProps, e);
		if (isDefined(pos)) {
			const { xValue, yValue, x, y } = pos;
			this.mutableState = { x, y };
			this.props.onMouseDown([xValue, yValue], e);
		}
	}
	xy(moreProps, e) {
		const { xAccessor } = moreProps;
		const { mouseXY, currentItem, xScale, chartConfig: { yScale } } = moreProps;
		const { enabled, snap, shouldDisableSnap, snapTo } = this.props;

		if (enabled && isDefined(currentItem) && isDefined(e)) {
			const xValue = xAccessor(currentItem);
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
			// console.log("HERE11", pos)
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
		return <GenericChartComponent
			onMouseMove={this.handleMousePosChange}
			onMouseDown={this.handleMouseDown}
			onContextMenu={this.handleContextMenu}

			svgDraw={this.renderSVG}
			isHover={functor(true)}

			canvasDraw={this.drawOnCanvas}
			canvasToDraw={getInteractiveCanvas}

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
	r: PropTypes.number.isRequired,
	stroke: PropTypes.string.isRequired,
	strokeWidth: PropTypes.number.isRequired,
	opacity: PropTypes.number.isRequired,
};

MouseLocationIndicator.defaultProps = {
	onMouseMove: noop,
	onMouseDown: noop,
	shouldDisableSnap: functor(false),
	stroke: "#000000",
	strokeWidth: 1,
	opacity: 1,
};

export default MouseLocationIndicator;