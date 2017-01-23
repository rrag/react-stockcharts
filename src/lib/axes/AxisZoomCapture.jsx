"use strict";

import React, { PropTypes, Component } from "react";
import { select, event as d3Event } from "d3-selection";
import { mean } from "d3-array";

import {
	first,
	last,
	isDefined,
	noop,
	mousePosition,
	d3Window,
	MOUSEMOVE,
	MOUSEUP,
} from "../utils";

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

		const { onContextMenu } = this.props;

		const mouseXY = mousePosition(e, this.node.getBoundingClientRect());

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
		const { getScale, getMoreProps } = this.props;
		const startScale = getScale(getMoreProps());
		this.dragHappened = false;

		if (startScale.invert) {
			select(d3Window(this.node))
				.on(MOUSEMOVE, this.handleDrag)
				.on(MOUSEUP, this.handleDragEnd);

			const startXY = mousePosition(e);
			const leftX = e.pageX - startXY[0],
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
		const e = d3Event;
		e.preventDefault();

		const { startPosition } = this.state;
		const { getMouseDelta, inverted } = this.props;

		this.dragHappened = true;
		if (isDefined(startPosition)) {
			const { startScale } = startPosition;
			const { startXY, leftX, topY } = startPosition;

			const mouseXY = [e.pageX - leftX, e.pageY - topY];

			const diff = getMouseDelta(startXY, mouseXY);

			const center = mean(startScale.range());

			const tempRange = startScale.range()
				.map(d => inverted ? d - sign(d - center) * diff : d + sign(d - center) * diff);

			const newDomain = tempRange.map(startScale.invert);

			if (sign(last(startScale.range()) - first(startScale.range())) === sign(last(tempRange) - first(tempRange))) {

				const { axisZoomCallback } = this.props;
				// console.log(startXScale.domain(), newXDomain)
				axisZoomCallback(newDomain);
			}
		}
	}
	handleDragEnd() {

		if (!this.dragHappened) {
			if (this.clicked) {
				const e = d3Event;
				const mouseXY = mousePosition(e, this.node.getBoundingClientRect());
				const { onDoubleClick } = this.props;

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
		const { bg, zoomCursorClassName } = this.props;

		const cursor = isDefined(this.state.startPosition)
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

export default AxisZoomCapture;
