"use strict";

import React, { PropTypes, Component } from "react";
import { select, event as d3Event } from "d3-selection";
import { mean } from "d3-array";

import { first, last, isDefined, noop } from "../utils";
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
		this.handleRightClick = this.handleRightClick.bind(this);
		this.saveNode = this.saveNode.bind(this);
		this.state = {
			startPosition: null
		};
	}
	saveNode(node) {
		this.node = node;
	}
	handleRightClick(e) {
		e.stopPropagation();
		e.preventDefault();

		var { onContextMenu } = this.props;

		var mouseXY = mousePosition(e, this.node.getBoundingClientRect());

		select(d3Window(this.node))
			.on(MOUSEMOVE, null)
			.on(MOUSEUP, null);
		this.setState({
			startPosition: null,
		});

		onContextMenu(mouseXY, e);

		this.contextMenuClicked = true;
	}
	handleDragStart(e) {
		var { getScale, getMoreProps } = this.props;
		var startScale = getScale(getMoreProps());
		this.dragHappened = false;

		if (startScale.invert) {
			select(d3Window(this.node))
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
		var e = d3Event;
		e.preventDefault();

		var { startPosition } = this.state;
		var { getMouseDelta,inverted } = this.props;

		this.dragHappened = true;
		if (isDefined(startPosition)) {
			var { startScale } = startPosition;
			var { startXY, leftX, topY } = startPosition;

			var mouseXY = [e.pageX - leftX, e.pageY - topY];

			var diff = getMouseDelta(startXY, mouseXY);

			var center = mean(startScale.range());

			var tempRange = startScale.range()
				.map(d => inverted?d - sign(d - center) * diff:d + sign(d - center) * diff);

			var newDomain = tempRange.map(startScale.invert);

			if (sign(last(startScale.range()) - first(startScale.range())) === sign(last(tempRange) - first(tempRange))) {

				var { axisZoomCallback } = this.props;
				// console.log(startXScale.domain(), newXDomain)
				axisZoomCallback(newDomain);
			}
		}
	}
	handleDragEnd() {

		if (!this.dragHappened) {
			if (this.clicked) {
				var e = d3Event;
				var mouseXY = mousePosition(e, this.node.getBoundingClientRect());
				var { onDoubleClick } = this.props;

				onDoubleClick(mouseXY, e);
			} else {
				this.clicked = true;
				setTimeout(() => {
					this.clicked = false;
				}, 300);
			}
		}

		select(d3Window(this.node))
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
			ref={this.saveNode}
			x={bg.x} y={bg.y} opacity={0} height={bg.h} width={bg.w}
			onContextMenu={this.handleRightClick}
			onMouseDown={this.handleDragStart}
			/>;
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
	inverted: PropTypes.bool,
	bg: PropTypes.object.isRequired,
	zoomCursorClassName: PropTypes.string.isRequired,
	getMoreProps: PropTypes.func.isRequired,
	getScale: PropTypes.func.isRequired,
	getMouseDelta: PropTypes.func.isRequired,
	onDoubleClick: PropTypes.func.isRequired,
	onContextMenu: PropTypes.func.isRequired,
};

AxisZoomCapture.defaultProps = {
	onDoubleClick: noop,
	onContextMenu: noop,
	inverted: true
};

AxisZoomCapture.contextTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
};

export default AxisZoomCapture;
