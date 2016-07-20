"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";

import { mousePosition, touchPosition, d3Window, MOUSEMOVE, MOUSEUP } from "./utils";

function getTouchProps(touch) {
	if (!touch) return {};
	return {
		pageX: touch.pageX,
		pageY: touch.pageY,
		clientX: touch.clientX,
		clientY: touch.clientY
	};
}



class EventCapture extends Component {
	constructor(props) {
		super(props);
		this.handleEnter = this.handleEnter.bind(this);
		this.handleLeave = this.handleLeave.bind(this);
		this.handleWheel = this.handleWheel.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handlePanEnd = this.handlePanEnd.bind(this);
		this.handlePan = this.handlePan.bind(this);
		this.handleTouchStart = this.handleTouchStart.bind(this);
		this.handleTouchMove = this.handleTouchMove.bind(this);
		this.handleTouchEnd = this.handleTouchEnd.bind(this);
		this.lastTouch = {};
		this.initialPinch = {};
		this.mouseInteraction = true;
	}
	getChildContext() {
		return {
			eventMeta: this.eventMeta,
		};
	}
	componentWillMount() {
		if (this.context.onFocus) this.context.onFocus(this.props.defaultFocus);
	}
	handleEnter(e) {
		var { eventMeta } = this.props;
		this.eventMeta = eventMeta(e, ["enter"]);

		if (this.context.onMouseEnter) {
			this.context.onMouseEnter(e);
		}
	}
	handleLeave(e) {
		var { eventMeta } = this.props;
		this.eventMeta = eventMeta(e, ["exit"]);

		if (this.context.onMouseLeave)
			this.context.onMouseLeave(e);
	}
	handleWheel(e) {
		var { zoom, onZoom, zoomMultiplier, eventMeta } = this.props;

		if (zoom && this.context.onZoom
				&& this.context.focus) {
			// e.stopPropagation();
			e.preventDefault();
			var newPos = mousePosition(e);
			var zoomDir = e.deltaY > 0 ? zoomMultiplier : -zoomMultiplier;

			this.eventMeta = eventMeta(e, ["zoom"]);

			this.context.onZoom(zoomDir, newPos, e);

			if (onZoom) {
				onZoom(newPos, e);
			}
		}

	}
	handleMouseMove(e) {
		var { eventMeta, onMouseMove } = this.props;
		this.eventMeta = eventMeta(e, ["mousemove"]);

		var newPos = mousePosition(e);

		if (this.mouseInteraction
				&& this.context.onMouseMove
				&& this.props.mouseMove
				&& !this.context.panInProgress) {
			this.context.onMouseMove(newPos, "mouse", e);
		}
		if (onMouseMove) onMouseMove(newPos, e);
	}
	handleMouseDown(e) {
		var mouseEvent = e || d3.event;
		var { pan, eventMeta } = this.props;

		this.eventMeta = eventMeta(mouseEvent, ["mousedown"]);

		var { onPanStart, focus, onFocus, xScale } = this.context;
		if (this.mouseInteraction && pan && onPanStart) {
			var mouseXY = mousePosition(mouseEvent);
			this.panStart = mouseXY;

			var dx = mouseEvent.pageX - mouseXY[0],
				dy = mouseEvent.pageY - mouseXY[1];

			var captureDOM = this.refs.capture;

			var win = d3Window(captureDOM);
			d3.select(win)
				.on(MOUSEMOVE, this.handlePan)
				.on(MOUSEUP, this.handlePanEnd);

			onPanStart(xScale.domain(), mouseXY, [dx, dy]);
		} else {
			if (!focus && onFocus) onFocus(true);
		}
		mouseEvent.preventDefault();
	}
	handleRightClick(e) {
		e.preventDefault();
		// console.log("RIGHT CLICK");
	}
	handlePan() {
		// console.log("handlePan")
		var e = d3.event;

		var { eventMeta } = this.props;
		var { pan: panEnabled, onPan: panListener } = this.props;
		var { deltaXY: dxdy, xScale, onPan } = this.context;

		var newPos = [e.pageX - dxdy[0], e.pageY - dxdy[1]];

		this.eventMeta = eventMeta(e, ["pan"]);
		// console.log("moved from- ", startXY, " to ", newPos);
		if (this.mouseInteraction && panEnabled && onPan) {

			onPan(newPos, xScale.domain(), e);
			if (panListener) {
				panListener(newPos, e);
			}
		}
	}
	handlePanEnd() {
		var e = d3.event;

		var { pan: panEnabled, eventMeta } = this.props;
		var { deltaXY: dxdy, onPanEnd } = this.context;


		var [startX, startY] = this.panStart;
		var [x, y] = [e.pageX - dxdy[0], e.pageY - dxdy[1]];

		var eventType = startX === x && startY === y ? ["click"] : [];

		this.eventMeta = eventMeta(e, ["mouseup"].concat(eventType));
		this.panStart = null;

		var captureDOM = this.refs.capture;

		var win = d3Window(captureDOM);

		if (this.mouseInteraction && panEnabled && onPanEnd) {
			d3.select(win)
				.on(MOUSEMOVE, null)
				.on(MOUSEUP, null);
			onPanEnd([x, y], e);
		}
		// e.preventDefault();
	}
	handleTouchStart(e) {
		this.mouseInteraction = false;

		var { pan: panEnabled } = this.props;
		var { deltaXY: dxdy } = this.context;

		var { onPanStart, onMouseMove, xScale, onPanEnd, panInProgress } = this.context;

		if (e.touches.length === 1) {
			var touch = getTouchProps(e.touches[0]);
			this.lastTouch = touch;
			var touchXY = touchPosition(touch, e);
			onMouseMove(touchXY, "touch", e);
			if (panEnabled && onPanStart) {
				var dx = touch.pageX - touchXY[0],
					dy = touch.pageY - touchXY[1];

				onPanStart(xScale.domain(), touchXY, [dx, dy]);
			}
		} else if (e.touches.length === 2) {
			// pinch zoom begin
			// do nothing pinch zoom is handled in handleTouchMove
			var touch1 = getTouchProps(e.touches[0]);

			if (panInProgress && panEnabled && onPanEnd) {
				// end pan first
				var newPos = [touch1.pageX - dxdy[0], touch1.pageY - dxdy[1]];
				onPanEnd(newPos, e);
				this.lastTouch = null;
			}
		}

		if (e.touches.length !== 2) this.initialPinch = null;
		// var newPos = mousePosition(e);
		// console.log("handleTouchStart", e);
		e.preventDefault();
		// e.stopPropagation();
		// this.context.onMouseMove(newPos, e);
	}
	handleTouchMove(e) {
		var { pan: panEnabled, onPan: panListener, zoom: zoomEnabled } = this.props;
		var { deltaXY: dxdy, xScale, onPan, onPinchZoom, focus, panInProgress } = this.context;

		if (e.touches.length === 1) {
			// pan
			var touch = this.lastTouch = getTouchProps(e.touches[0]);

			var newPos = [touch.pageX - dxdy[0], touch.pageY - dxdy[1]];
			if (panInProgress && panEnabled && onPan) {
				onPan(newPos, xScale.domain());
				if (panListener) {
					panListener(e);
				}
			}
		} else if (e.touches.length === 2) {
			// pinch zoom
			if (zoomEnabled && onPinchZoom && focus) {
				var touch1 = getTouchProps(e.touches[0]);
				var touch2 = getTouchProps(e.touches[1]);

				var touch1Pos = touchPosition(touch1, e);
				var touch2Pos = touchPosition(touch2, e);

				if (this.initialPinch === null) {
					this.initialPinch = {
						touch1Pos,
						touch2Pos,
						xScale,
						range: xScale.range(),
					};
				} else if (this.initialPinch && !panInProgress) {
					onPinchZoom(this.initialPinch, {
						touch1Pos,
						touch2Pos,
						xScale,
					});
				}
			}
		}
		e.preventDefault();

		// console.log("handleTouchMove", e);
	}
	handleTouchEnd(e) {
		// TODO enableMouseInteraction
		var { pan: panEnabled } = this.props;
		var { deltaXY: dxdy, onPanEnd, panInProgress } = this.context;

		if (this.lastTouch) {
			var newPos = [this.lastTouch.pageX - dxdy[0], this.lastTouch.pageY - dxdy[1]];

			this.initialPinch = null;
			if (panInProgress && panEnabled && onPanEnd) {
				onPanEnd(newPos, e);
			}
		}
		// console.log("handleTouchEnd", dxdy, newPos, e);
		this.mouseInteraction = true;
		e.preventDefault();
	}
	render() {
		var className = this.context.panInProgress ? "react-stockcharts-grabbing-cursor" : "react-stockcharts-crosshair-cursor";
		var clipStyle = { "clipPath": "url(#chart-area-clip)" };
		return (
			<g style={clipStyle}>
				<rect ref="capture"
					className={className}
					width={this.context.width} height={this.context.height} style={{ opacity: 0 }}
					onMouseEnter={this.handleEnter}
					onMouseLeave={this.handleLeave}
					onMouseMove={this.handleMouseMove}
					onWheel={this.handleWheel}
					onMouseDown={this.handleMouseDown}
					onContextMenu={this.handleRightClick}
					onTouchStart={this.handleTouchStart}
					onTouchEnd={this.handleTouchEnd}
					onTouchMove={this.handleTouchMove} />
				{this.props.children}
			</g>
		);
	}
}

EventCapture.propTypes = {
	mouseMove: PropTypes.bool.isRequired,
	zoom: PropTypes.bool.isRequired,
	zoomMultiplier: PropTypes.number.isRequired,
	pan: PropTypes.bool.isRequired,
	panSpeedMultiplier: PropTypes.number.isRequired,
	defaultFocus: PropTypes.bool.isRequired,
	useCrossHairStyle: PropTypes.bool.isRequired,
	onZoom: PropTypes.func,
	onPan: PropTypes.func,
	onMouseMove: PropTypes.func,
	eventMeta: PropTypes.func,
	children: PropTypes.node,
};

EventCapture.defaultProps = {
	mouseMove: false,
	zoom: false,
	zoomMultiplier: 1,
	pan: false,
	panSpeedMultiplier: 1,
	defaultFocus: false,
	useCrossHairStyle: true,
	eventMeta: (e, type) => { var { button, shiftKey } = e; return { button, shiftKey, type }; },
};

EventCapture.contextTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	panInProgress: PropTypes.bool,
	focus: PropTypes.bool.isRequired,
	chartConfig: PropTypes.array,
	xScale: PropTypes.func.isRequired,
	xAccessor: PropTypes.func.isRequired,
	deltaXY: PropTypes.arrayOf(Number),

	onMouseMove: PropTypes.func,
	onMouseEnter: PropTypes.func,
	onMouseLeave: PropTypes.func,
	onZoom: PropTypes.func,
	onPinchZoom: PropTypes.func,
	onPanStart: PropTypes.func,
	onPan: PropTypes.func,
	onPanEnd: PropTypes.func,
	onFocus: PropTypes.func,
};

EventCapture.childContextTypes = {
	eventMeta: PropTypes.object,
};

export default EventCapture;
