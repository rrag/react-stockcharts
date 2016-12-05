"use strict";

import React, { PropTypes, Component } from "react";
import { select, event as d3Event } from "d3-selection";

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
		this.saveNode = this.saveNode.bind(this);
		this.lastTouch = {};
		this.initialPinch = {};
		this.mouseInteraction = true;
		this.state = {
			panInProgress: false,
		};
	}
	saveNode(node) {
		this.node = node;
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
		var { zoom, onZoom } = this.props;

		if (zoom && this.focus && e.deltaY !== 0) {
			e.preventDefault();

			var newPos = mousePosition(e);
			var zoomDir = e.deltaY > 0 ? 1 : -1;

			onZoom(zoomDir, newPos, e);
		}
	}
	handleMouseMove(e) {
		var { onMouseMove, mouseMove } = this.props;

		if (this.mouseInteraction
				&& mouseMove
				&& !this.state.panInProgress) {

			var newPos = mousePosition(e);

			onMouseMove(newPos, "mouse", e);
		}
	}
	handleRightClick(e) {
		e.stopPropagation();
		e.preventDefault();

		var { onContextMenu, onPanEnd } = this.props;

		var mouseXY = mousePosition(e, this.node.getBoundingClientRect());

		if (isDefined(this.state.panStart)) {
			var { panStartXScale, panOrigin, chartsToPan } = this.state.panStart;
			if (this.panHappened) {
				onPanEnd(mouseXY, panStartXScale, panOrigin, chartsToPan, e);
			}
			var win = d3Window(this.node);
			select(win)
				.on(MOUSEMOVE, null)
				.on(MOUSEUP, null);

			this.setState({
				panInProgress: false,
				panStart: null,
			});
		}

		onContextMenu(mouseXY, e);

		this.contextMenuClicked = true;
	}
	handleMouseDown(e) {
		var { pan, xScale, chartConfig, onMouseDown } = this.props;
		this.panHappened = false;
		this.focus = true;

		if (!this.state.panInProgress && this.mouseInteraction) {

			var mouseXY = mousePosition(e);

			var currentCharts = getCurrentCharts(chartConfig, mouseXY);

			this.setState({
				panInProgress: pan,
				panStart: {
					panStartXScale: xScale,
					panOrigin: mouseXY,
					chartsToPan: currentCharts
				},
			});

			if (pan) {
				var win = d3Window(this.node);
				select(win)
					.on(MOUSEMOVE, this.handlePan)
					.on(MOUSEUP, this.handlePanEnd);
			}

			if (!pan) {
				// This block of code gets executed when
				// drawMode is enabled,
				// pan is disabled in draw mode
				e.persist();
				setTimeout(() => {
					if (!this.contextMenuClicked) {
						// console.log("NO RIGHT")
						onMouseDown(mouseXY, currentCharts, e);
					}
					this.contextMenuClicked = false;
				}, 100);
			}
		}
		e.preventDefault();
	}
	handlePan() {
		var e = d3Event;
		var { pan: panEnabled, onPan } = this.props;

		// console.log("moved from- ", startXY, " to ", newPos);

		if (this.mouseInteraction
				&& panEnabled
				&& onPan
				&& isDefined(this.state.panStart)) {

			this.panHappened = true;

			var { panStartXScale, panOrigin, chartsToPan } = this.state.panStart;

			var rect = this.node.getBoundingClientRect();
			var newPos = [Math.round(e.pageX - rect.left), Math.round(e.pageY - rect.top)];

			onPan(newPos, panStartXScale, panOrigin, chartsToPan, e);
		}
	}
	handlePanEnd() {
		var e = d3Event;

		var { pan: panEnabled, onPanEnd, onClick, onDoubleClick } = this.props;

		if (isDefined(this.state.panStart)) {
			var { panStartXScale, panOrigin, chartsToPan } = this.state.panStart;

			var rect = this.node.getBoundingClientRect();
			var newPos = [Math.round(e.pageX - rect.left), Math.round(e.pageY - rect.top)];

			if (!this.panHappened) {
				if (this.clicked) {
					onDoubleClick(newPos, e);
					this.clicked = false;
				} else {
					this.clicked = true;
					setTimeout(() => {
						if (this.clicked) {
							onClick(newPos, e);
							this.clicked = false;
						}
					}, 300);
				}
			}

			if (this.mouseInteraction
					&& this.panHappened
					// && !this.contextMenuClicked
					&& panEnabled
					&& onPanEnd) {
				var win = d3Window(this.node);
				select(win)
					.on(MOUSEMOVE, null)
					.on(MOUSEUP, null);
				onPanEnd(newPos, panStartXScale, panOrigin, chartsToPan, e);
			}

			this.setState({
				panInProgress: false,
				panStart: null,
			});
		}
	}
	handleTouchStart(e) {
		this.mouseInteraction = false;

		var { pan: panEnabled } = this.props;

		var { xScale, onPanEnd } = this.props;

		if (e.touches.length === 1) {
			var touch = getTouchProps(e.touches[0]);
			var touchXY = touchPosition(touch, e);
			this.lastTouch = touch;
			// onMouseMove(touchXY, "touch", e);
			if (panEnabled) {
				const dx = touch.pageX - touchXY[0],
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
				const { dx, dy, panStartXScale, panOrigin } = panStart;

				// end pan first
				var newPos = [touch1.pageX - dx, touch1.pageY - dy];
				this.lastTouch = null;

				this.setState({
					panInProgress: false,
					panStart: null,
				});
				onPanEnd(newPos, panStartXScale, panOrigin, e);
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

			if (panInProgress && panEnabled && onPan) {
				var { dx, dy, panStartXScale, panOrigin, chartsToPan } = panStart;

				var newPos = [touch.pageX - dx, touch.pageY - dy];
				onPan(newPos, panStartXScale, panOrigin, chartsToPan, e);
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

		if (this.lastTouch && isDefined(panStart)) {
			var { dx, dy, panStartXScale, panOrigin, chartsToPan } = panStart;
			var newPos = [this.lastTouch.pageX - dx, this.lastTouch.pageY - dy];

			this.initialPinch = null;

			if (panInProgress && panEnabled && onPanEnd) {

				onPanEnd(newPos, panStartXScale, panOrigin, chartsToPan, e);
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
			<rect ref={this.saveNode}
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
	pan: PropTypes.bool.isRequired,
	panSpeedMultiplier: PropTypes.number.isRequired,
	focus: PropTypes.bool.isRequired,

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

	onClick: PropTypes.func,
	onDoubleClick: PropTypes.func,
	onContextMenu: PropTypes.func,
	onMouseDown: PropTypes.func,
	children: PropTypes.node,
};

EventCapture.defaultProps = {
	mouseMove: false,
	zoom: false,
	pan: false,
	panSpeedMultiplier: 1,
	focus: false,
};

export default EventCapture;
