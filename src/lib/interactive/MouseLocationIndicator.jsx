import React, { PropTypes, Component } from "react";
import d3 from "d3";

import GenericChartComponent from "../GenericChartComponent";

import { isDefined, mousePosition, getClosestValue, touchPosition, d3Window, MOUSEMOVE, MOUSEUP } from "../utils";
import { noop, shallowEqual } from "../utils";
import { getCurrentCharts } from "../utils/ChartDataUtil";

class MouseLocationIndicator extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);

		this.handleMousePosChange = this.handleMousePosChange.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.xy = this.xy.bind(this);

		this.mutableState = {};
	}
	handleMouseDown(e) {
		var moreProps = this.refs.component.getMoreProps();
		var pos = this.xy(moreProps, e);
		if (isDefined(pos)) {
		 	var { xValue, yValue, x, y } = pos;
			this.mutableState = { x, y }
			this.props.onMouseDown([xValue, yValue], e);
		}
	}
	xy(moreProps, e) {
		var { xAccessor } = this.context;
		var { mouseXY, currentItem, xScale, chartConfig: { yScale } } = moreProps;
		var { enabled, snap, shouldDisableSnap, snapTo, onMouseMove } = this.props;

		if (enabled && isDefined(currentItem) && isDefined(e)) {

			var xValue = xAccessor(currentItem);
			var yValue = snap && !shouldDisableSnap(e)
				? getClosestValue(snapTo(currentItem), yScale.invert(mouseXY[1]))
				: yScale.invert(mouseXY[1]);

			var x = xScale(xValue);
			var y = yScale(yValue);

			return { xValue, yValue, x, y }
		}
	}
	handleMousePosChange(e) {
		// var { idx, onMouseEnter } = this.props;
		var moreProps = this.refs.component.getMoreProps();
		var prevMoreProps = this.refs.component.getPrevMoreProps();

		if (!shallowEqual(moreProps.mousXY, prevMoreProps.mouseXY)) {
			var pos = this.xy(moreProps, e);
			// console.log("HERE11", pos)
			if (isDefined(pos)) {
		 		var { xValue, yValue, x, y } = pos;
				this.mutableState = { x, y }
				this.props.onMouseMove([xValue, yValue], e);
			}
		}
		// console.log(this.refs.component.getRef("capture"))
	}
	renderSVG(moreProps) {
		var { enabled, r, stroke, strokeWidth, opacity } = this.props;
		var { x, y } = this.mutableState
		var { show } = moreProps
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
		return <GenericChartComponent ref="component"
			svgDraw={this.renderSVG}
			onMouseMove={this.handleMousePosChange}
			isHover={d3.functor(true)}
			onMouseDown={this.handleMouseDown}
			onContextMenu={this.handleClick}
			drawOnMouseExitOfCanvas
			/>;
	}
}

MouseLocationIndicator.propTypes = {
	enabled: PropTypes.bool.isRequired,
	snap: PropTypes.bool.isRequired,
	shouldDisableSnap: PropTypes.func.isRequired,
	snapTo: PropTypes.func.isRequired,
}

MouseLocationIndicator.contextTypes = {
	xAccessor: PropTypes.func.isRequired,
}

MouseLocationIndicator.defaultProps = {
	onMouseMove: noop,
	onMouseDown: noop,
}

export default MouseLocationIndicator