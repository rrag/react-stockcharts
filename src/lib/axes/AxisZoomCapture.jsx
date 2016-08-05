"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";

import { first, last, isDefined } from "../utils";
import { mousePosition, d3Window, MOUSEMOVE, MOUSEUP } from "../utils";

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
		var { getScale, getMoreProps } = this.props;
		var startScale = getScale(getMoreProps());

		if (startScale.invert) {
			d3.select(d3Window(this.refs.capture))
				.on(MOUSEMOVE, this.handleDrag)
				.on(MOUSEUP, this.handleDragEnd);

			var startXY = mousePosition(e);
			var leftX = e.pageX - startXY[0],
				topY = e.pageY - startXY[1];

			this.setState({
				startPosition: {
					startXY,
					leftX,
					topY,
					startScale,
				}
			});
		}
		e.preventDefault();
	}
	handleDrag() {
		var e = d3.event;
		e.preventDefault();

		var { startPosition } = this.state;
		var { getMouseDelta } = this.props;

		if (isDefined(startPosition)) {
			var { startScale } = startPosition;
			var { startXY, leftX, topY } = startPosition;

			var mouseXY = [e.pageX - leftX, e.pageY - topY];

			var diff = getMouseDelta(startXY, mouseXY);

			var center = d3.mean(startScale.range());

			var tempRange = startScale.range()
				.map(d => d + sign(d - center) * diff);

			var newDomain = tempRange.map(startScale.invert);

			if (sign(last(startScale.range()) - first(startScale.range())) === sign(last(tempRange) - first(tempRange))) {

				var { axisZoomCallback } = this.props;
				// console.log(startXScale.domain(), newXDomain)
				axisZoomCallback(newDomain);
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
	zoomCursorClassName: PropTypes.string.isRequired,
	getMoreProps: PropTypes.func.isRequired,
	getScale: PropTypes.func.isRequired,
	getMouseDelta: PropTypes.func.isRequired,
};

AxisZoomCapture.contextTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
};

export default AxisZoomCapture;
