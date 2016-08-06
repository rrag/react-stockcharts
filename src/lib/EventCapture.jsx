"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";

import { isDefined, mousePosition, touchPosition, d3Window, MOUSEMOVE, MOUSEUP } from "./utils";
import { getCurrentCharts } from "./utils/ChartDataUtil";

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
		this.handleRightClick = this.handleRightClick.bind(this);
		this.lastTouch = {};
		this.initialPinch = {};
		this.mouseInteraction = true;
		this.state = {
			panInProgress: false,
		};
	}

	componentWillMount() {
		this.focus = this.props.focus;
	}
	handleEnter(e) {
		var { onMouseEnter } = this.props;
		onMouseEnter(e);
	}
	handleLeave(e) {
		var { onMouseLeave } = this.props;
		onMouseLeave(e);
	}
	handleWheel(e) {
		var { zoom, onZoom, zoomMultiplier, eventMeta } = this.props;

		if (zoom && this.focus) {
			e.preventDefault();

			var newPos = mousePosition(e);
			var zoomDir = e.deltaY > 0 ? zoomMultiplier : -zoomMultiplier;

			onZoom(zoomDir, newPos, e);
		}
	}
	handleMouseMove(e) {
		var { onMouseMove, mouseMove } = this.props;

		if (this.mouseInteraction
				&& mouseMove
				&& !this.panInProgress) {

			var newPos = mousePosition(e);

			onMouseMove(newPos, "mouse", e);
		}
	}
	handleRightClick(e) {
		e.stopPropagation();
		e.preventDefault();

		var { onPanEnd, onContextMenu } = this.props;
		var { dx, dy } = this.panStart;

		var newPos = [e.pageX - dx, e.pageY - dy];
		// var newPos = mousePosition(e)

		this.contextMenuClicked = true;

		console.log("contextmenu", newPos)
		// this line below has to be before the trigger of onPanEnd
		// this is because onPanEnd will trigger a click event incase no pan happened
		// having this before, will help suppress the click event and send only the
		// right click event
		onContextMenu(newPos, e);

		var win = d3Window(this.refs.capture);
		d3.select(win)
			.on(MOUSEMOVE, null)
			.on(MOUSEUP, null);
		// onPanEnd(newPos, e);
	}
	handleMouseDown(e) {
		var { pan, xScale, chartConfig } = this.props;
		console.log("mousedown")

		if (!this.state.panInProgress) {
			this.focus = true;

			if (this.mouseInteraction && pan) {
				var mouseXY = mousePosition(e);

				this.panHappened = false;

				var dx = e.pageX - mouseXY[0],
					dy = e.pageY - mouseXY[1];

				var currentCharts = getCurrentCharts(chartConfig, mouseXY);

				this.setState({
					panInProgress: true,
					panStart: {
						panStartXScale: xScale,
						panOrigin: mouseXY,
						dx, dy,
						chartsToPan: currentCharts
					},
				})

				var win = d3Window(this.refs.capture);
				d3.select(win)
					.on(MOUSEMOVE, this.handlePan)
					.on(MOUSEUP, this.handlePanEnd);

			}
		}
		e.preventDefault();
	}
	handlePan() {
		var e = d3.event;
		var { pan: panEnabled, onPan, xScale } = this.props;

		// console.log("moved from- ", startXY, " to ", newPos);

		if (this.mouseInteraction
				&& panEnabled
				&& onPan
				&& isDefined(this.state.panStart)) {

			this.panHappened = true;

			var { dx, dy, panStartXScale, panOrigin, chartsToPan } = this.state.panStart;
			var newPos = [e.pageX - dx, e.pageY - dy];

			onPan(newPos, panStartXScale, panOrigin, chartsToPan, e);
		}
	}
	handlePanEnd() {
		var e = d3.event;

		var { pan: panEnabled, onPanEnd, onClick, onDoubleClick } = this.props;
		var { dx, dy, panStartXScale, panOrigin, chartsToPan } = this.state.panStart;

		var newPos = [e.pageX - dx, e.pageY - dy];

		this.setState({
			panInProgress: false,
			panStart: null,
		}, () => {
			if (!this.panHappened && !this.contextMenuClicked) {
				if (this.clicked) {
					onDoubleClick(newPos, e)
				} else {
					this.clicked = true
					setTimeout(() => {
						this.clicked = false;
					}, 300);
					onClick(newPos, e)
				}
			}

			if (this.mouseInteraction
					&& this.panHappened
					&& !this.contextMenuClicked
					&& panEnabled
					&& onPanEnd) {
				var win = d3Window(this.refs.capture);
				d3.select(win)
					.on(MOUSEMOVE, null)
					.on(MOUSEUP, null);
				onPanEnd(newPos, panStartXScale, panOrigin, chartsToPan, e);
			}

			this.contextMenuClicked = false;
		})
	}
	handleTouchStart(e) {
		this.mouseInteraction = false;

		var { pan: panEnabled } = this.props;

		var { onMouseMove, xScale, onPanEnd } = this.props;

		if (e.touches.length === 1) {
			var touch = getTouchProps(e.touches[0]);
			var touchXY = touchPosition(touch, e);
			this.lastTouch = touch;
			// onMouseMove(touchXY, "touch", e);
			if (panEnabled) {
				var dx = touch.pageX - touchXY[0],
					dy = touch.pageY - touchXY[1];

				this.setState({
					panInProgress: true,
					panStart: {
						panStartXScale: xScale,
						panOrigin: touchXY,
						dx, dy
					}
				});
			}
		} else if (e.touches.length === 2) {
			// pinch zoom begin
			// do nothing pinch zoom is handled in handleTouchMove
			var touch1 = getTouchProps(e.touches[0]);
			var { panInProgress, panStart } = this.state;

			if (panInProgress && panEnabled && onPanEnd) {
				var { dx, dy, panStartXScale, panOrigin } = panStart;

				// end pan first
				var newPos = [touch1.pageX - dx, touch1.pageY - dy];
				this.lastTouch = null;

				this.setState({
					panInProgress: false,
					panStart: null,
				}, () => {
					onPanEnd(newPos, panStartXScale, panOrigin, e)
				})
			}
		}

		if (e.touches.length !== 2) this.initialPinch = null;

		// console.log("handleTouchStart", e);
		e.preventDefault();
	}
	handleTouchMove(e) {
		var { pan: panEnabled, zoom: zoomEnabled } = this.props;
		var { xScale, onPan, onPinchZoom } = this.props;
		var { panInProgress, panStart } = this.state;

		if (e.touches.length === 1) {
			// pan
			var touch = this.lastTouch = getTouchProps(e.touches[0]);
			var { dx, dy, panStartXScale, panOrigin } = this.state.panStart;

			var newPos = [touch.pageX - dx, touch.pageY - dy];

			if (panInProgress && panEnabled && onPan) {
				onPan(newPos, panStartXScale, panOrigin, e);
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
		var { pan: panEnabled, onPanEnd } = this.props;
		var { panInProgress, panStart } = this.state;

		if (this.lastTouch) {
			var newPos = [this.lastTouch.pageX - dxdy[0], this.lastTouch.pageY - dxdy[1]];

			this.initialPinch = null;

			if (panInProgress && panEnabled && onPanEnd) {
				var { dx, dy, panStartXScale, panOrigin } = panStart;

				onPanEnd(newPos, panStartXScale, panOrigin, e);
			}
		}
		// console.log("handleTouchEnd", dxdy, newPos, e);
		this.mouseInteraction = true;
		e.preventDefault();
	}
	render() {
		var { height, width } = this.props;
		var className = this.state.panInProgress ? "react-stockcharts-grabbing-cursor" : "react-stockcharts-crosshair-cursor";
		return (
			<rect ref="capture"
				className={className}
				width={width} height={height} style={{ opacity: 0 }}
				onMouseEnter={this.handleEnter}
				onMouseLeave={this.handleLeave}
				onMouseMove={this.handleMouseMove}
				onWheel={this.handleWheel}
				onMouseDown={this.handleMouseDown}
				onContextMenu={this.handleRightClick}
				onTouchStart={this.handleTouchStart}
				onTouchEnd={this.handleTouchEnd}
				onTouchMove={this.handleTouchMove} />
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

	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	chartConfig: PropTypes.array,
	xScale: PropTypes.func.isRequired,
	xAccessor: PropTypes.func.isRequired,

	onMouseMove: PropTypes.func,
	onMouseEnter: PropTypes.func,
	onMouseLeave: PropTypes.func,
	onZoom: PropTypes.func,
	onPinchZoom: PropTypes.func,
	onPan: PropTypes.func,
	onPanEnd: PropTypes.func,

	onContextMenu: PropTypes.func,
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
	// eventMeta: (e, type) => { var { button, shiftKey } = e; return { button, shiftKey, type }; },
};

export default EventCapture;
