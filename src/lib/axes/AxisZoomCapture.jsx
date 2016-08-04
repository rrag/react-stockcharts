"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";

import GenericChartComponent, { getAxisCanvas } from "../GenericChartComponent";

import { first, last, hexToRGBA, isNotDefined, isDefined, identity } from "../utils";
import { mousePosition, touchPosition, d3Window, MOUSEMOVE, MOUSEUP } from "../utils";

function sign(x) {
	return (x > 0) - (x < 0);
}

class AxisZoomCapture extends Component {
	constructor(props) {
		super(props);
		this.handleDragStart = this.handleDragStart.bind(this);
		this.handleDrag = this.handleDrag.bind(this);
		this.handleDragEnd = this.handleDragEnd.bind(this);
		this.state = {
			startPosition: null
		};
	}
	handleDragStart(e) {
		d3.select(d3Window(this.refs.capture))
			.on(MOUSEMOVE, this.handleDrag)
			.on(MOUSEUP, this.handleDragEnd);

		var startXY = mousePosition(e);
		var leftX = e.pageX - startXY[0],
			topY = e.pageY - startXY[1];

		var { chartConfig: { id, yScale }, xScale } = this.props.getMoreProps();

		this.setState({
			startPosition: {
				startXY,
				leftX,
				topY,
				startXScale: xScale.copy(),
				startYScale: yScale.copy(),
			}
		});
		e.preventDefault();
	}
	handleDrag() {
		var e = d3.event;
		e.preventDefault();

		var { startPosition } = this.state;

		if (isDefined(startPosition)) {
			var { startXY, leftX, topY } = startPosition;
			var { startXScale, startYScale } = startPosition;

			var mouseXY = [e.pageX - leftX, e.pageY - topY];

			var dx = startXY[0] - mouseXY[0];
			var dy = startXY[1] - mouseXY[1];

			var { chartConfig: { id, yScale }, xScale } = this.props.getMoreProps();

			var cy = d3.mean(startYScale.range());
			var cx = d3.mean(startXScale.range());

			var tempYRange = startYScale.range()
				.map(d => d + sign(d - cy) * dy);
			var newYDomain = tempYRange.map(startYScale.invert);

			var tempXRange = startXScale.range()
				.map(d => d + sign(d - cx) * dx);
			var newXDomain = tempXRange.map(startXScale.invert);

			if (sign(last(startYScale.range()) - first(startYScale.range())) === sign(last(tempYRange) - first(tempYRange))
				&& sign(last(startXScale.range()) - first(startXScale.range())) === sign(last(tempXRange) - first(tempXRange))) {

				var { axisZoomCallback } = this.props;
				// console.log(startXScale.domain(), newXDomain)
				axisZoomCallback(newXDomain, newYDomain);				
			}
		}
	}
	handleDragEnd() {
		d3.select(d3Window(this.refs.capture))
			.on(MOUSEMOVE, null)
			.on(MOUSEUP, null);
		this.setState({
			startPosition: null,
		});
	}
	render() {
		var { bg, zoomCursorClassName } = this.props;

		var cursor = isDefined(this.state.startPosition)
			? zoomCursorClassName
			: "react-stockcharts-default-cursor";

		return <rect
			className={`react-stockcharts-enable-interaction ${cursor}`}
			ref="capture"
			x={bg.x} y={bg.y} opacity={0} height={bg.h} width={bg.w}
			onMouseDown={this.handleDragStart} />;
	}
}

AxisZoomCapture.propTypes = {
	innerTickSize: PropTypes.number,
	outerTickSize: PropTypes.number,
	tickFormat: PropTypes.func,
	tickPadding: PropTypes.number,
	tickSize: PropTypes.number,
	ticks: PropTypes.number,
	tickValues: PropTypes.array,
	showDomain: PropTypes.bool,
	showTicks: PropTypes.bool,
	className: PropTypes.string,
	axisZoomCallback: PropTypes.func,

	bg: PropTypes.object.isRequired,
};

AxisZoomCapture.contextTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
};

export default AxisZoomCapture;
