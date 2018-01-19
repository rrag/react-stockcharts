"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { select, event as d3Event, mouse, touches } from "d3-selection";

import {
	isDefined, mousePosition, touchPosition, getTouchProps,
	d3Window,
	MOUSEMOVE, MOUSEUP,
	MOUSEENTER, MOUSELEAVE,
	TOUCHMOVE, TOUCHEND,
	noop
} from "./utils";
import { getCurrentCharts } from "./utils/ChartDataUtil";
// import { clearTimeout, setTimeout } from "timers";

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
		this.handlePinchZoom = this.handlePinchZoom.bind(this);
		this.handlePinchZoomEnd = this.handlePinchZoomEnd.bind(this);

		this.handleClick = this.handleClick.bind(this);

		this.handleRightClick = this.handleRightClick.bind(this);
		this.handleDrag = this.handleDrag.bind(this);
		this.handleDragEnd = this.handleDragEnd.bind(this);

		this.shouldPan = this.shouldPan.bind(this);
		this.canPan = this.canPan.bind(this);

		this.setCursorClass = this.setCursorClass.bind(this);
		this.saveNode = this.saveNode.bind(this);

		this.mouseInside = false;

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
	componentDidMount() {
		if (this.node) {
			select(this.node)
				.on(MOUSEENTER, this.handleEnter)
				.on(MOUSELEAVE, this.handleLeave);
		}
	}
	componentDidUpdate() {
		this.componentDidMount();
	}
	componentWillUnmount() {
		if (this.node) {
			select(this.node)
				.on(MOUSEENTER, null)
				.on(MOUSELEAVE, null);
			const win = d3Window(this.node);
			select(win)
				.on(MOUSEMOVE, null);
		}
	}
	handleEnter() {
		const e = d3Event;

		const { onMouseEnter } = this.props;
		this.mouseInside = true;
		if (!this.state.panInProgress
				&& !this.state.dragInProgress) {
			const win = d3Window(this.node);
			select(win)
				.on(MOUSEMOVE, this.handleMouseMove);
		}
		onMouseEnter(e);
	}
	handleLeave(e) {
		const { onMouseLeave } = this.props;
		this.mouseInside = false;
		if (!this.state.panInProgress
				&& !this.state.dragInProgress) {
			const win = d3Window(this.node);
			select(win)
				.on(MOUSEMOVE, null);
		}
		onMouseLeave(e);
	}
	handleWheel(e) {
		const { zoom, onZoom } = this.props;
		const { panInProgress } = this.state;

		const yZoom = Math.abs(e.deltaY) > Math.abs(e.deltaX) && Math.abs(e.deltaY) > 0;
		// const xPan = Math.abs(e.deltaY) < Math.abs(e.deltaX) && Math.abs(e.deltaX) > 0;
		const mouseXY = mousePosition(e);
		e.preventDefault();

		if (zoom && this.focus && yZoom && !panInProgress) {
			const zoomDir = e.deltaY > 0 ? 1 : -1;

			onZoom(zoomDir, mouseXY, e);
		} else if (this.focus) {
			if (this.shouldPan()) {
				// console.log("Do pan now...")
				// pan already in progress
				const {
					panStartXScale,
					chartsToPan
				} = this.state.panStart;
				this.lastNewPos = mouseXY;
				this.panHappened = true;

				this.dx += e.deltaX;
				this.dy += e.deltaY;
				const dxdy = { dx: this.dx, dy: this.dy };

				this.props.onPan(mouseXY, panStartXScale, dxdy, chartsToPan, e);
			} else {
				// console.log("Pan start...")
				// pan start

				const { xScale, chartConfig } = this.props;
				const currentCharts = getCurrentCharts(chartConfig, mouseXY);

				this.dx = 0;
				this.dy = 0;
				this.setState({
					panInProgress: true,
					panStart: {
						panStartXScale: xScale,
						panOrigin: mouseXY,
						chartsToPan: currentCharts
					},
				});
			}
			this.queuePanEnd();
		}
	}
	queuePanEnd() {
		if (isDefined(this.panEndTimeout)) {
			clearTimeout(this.panEndTimeout);
		}
		this.panEndTimeout = setTimeout(() => {
			this.handlePanEnd();
		}, 100);
	}
	handleMouseMove() {
		const e = d3Event;

		const { onMouseMove, mouseMove } = this.props;

		if (this.mouseInteraction
				&& mouseMove
				&& !this.state.panInProgress) {

			const newPos = mouse(this.node);

			onMouseMove(newPos, "mouse", e);
		}
	}
	handleClick(e) {
		const mouseXY = mousePosition(e);
		const { onClick, onDoubleClick } = this.props;

		if (!this.panHappened && !this.dragHappened) {
			if (this.clicked) {
				onDoubleClick(mouseXY, e);
				this.clicked = false;
			} else {
				onClick(mouseXY, e);
				this.clicked = true;
				setTimeout(() => {
					if (this.clicked) {
						this.clicked = false;
					}
				}, 400);
			}
		}
	}
	handleRightClick(e) {
		e.stopPropagation();
		e.preventDefault();
		const { onContextMenu, onPanEnd } = this.props;

		const mouseXY = mousePosition(e, this.node.getBoundingClientRect());

		if (isDefined(this.state.panStart)) {
			const { panStartXScale, panOrigin, chartsToPan } = this.state.panStart;
			if (this.panHappened) {
				onPanEnd(mouseXY, panStartXScale, panOrigin, chartsToPan, e);
			}
			const win = d3Window(this.node);
			select(win)
				.on(MOUSEMOVE, null)
				.on(MOUSEUP, null);

			this.setState({
				panInProgress: false,
				panStart: null,
			});
		}

		onContextMenu(mouseXY, e);
	}

	handleDrag() {
		const e = d3Event;
		if (this.props.onDrag) {
			this.dragHappened = true;
			const mouseXY = mouse(this.node);
			this.props.onDrag({
				startPos: this.state.dragStartPosition,
				mouseXY
			}, e);
		}
	}
	cancelDrag() {
		const win = d3Window(this.node);
		select(win)
			.on(MOUSEMOVE, this.mouseInside ? this.handleMouseMove : null)
			.on(MOUSEUP, null);

		this.setState({
			dragInProgress: false,
		});
		this.mouseInteraction = true;
	}
	handleDragEnd() {
		const e = d3Event;
		const mouseXY = mouse(this.node);

		const win = d3Window(this.node);
		select(win)
			.on(MOUSEMOVE, this.mouseInside ? this.handleMouseMove : null)
			.on(MOUSEUP, null);

		if (this.dragHappened) {
			this.props.onDragComplete({
				mouseXY
			}, e);
		}

		this.setState({
			dragInProgress: false,
		});
		this.mouseInteraction = true;
	}
	canPan() {
		const { getAllPanConditions } = this.props;
		const { pan: initialPanEnabled } = this.props;

		const {
			panEnabled,
			draggable: somethingSelected
		} = getAllPanConditions()
			.reduce((returnObj, a) => {
				return {
					draggable: returnObj.draggable || a.draggable,
					panEnabled: returnObj.panEnabled && a.panEnabled,
				};
			}, {
				draggable: false,
				panEnabled: initialPanEnabled,
			});

		return {
			panEnabled,
			somethingSelected
		};
	}
	handleMouseDown(e) {
		if (e.button !== 0) {
			return;
		}
		const { xScale, chartConfig, onMouseDown } = this.props;

		this.panHappened = false;
		this.dragHappened = false;
		this.focus = true;

		if (!this.state.panInProgress
			&& this.mouseInteraction
		) {

			const mouseXY = mousePosition(e);
			const currentCharts = getCurrentCharts(chartConfig, mouseXY);
			const {
				panEnabled, somethingSelected
			} = this.canPan();
			const pan = panEnabled && !somethingSelected;

			if (pan) {
				this.setState({
					panInProgress: pan,
					panStart: {
						panStartXScale: xScale,
						panOrigin: mouseXY,
						chartsToPan: currentCharts
					},
				});

				const win = d3Window(this.node);
				select(win)
					.on(MOUSEMOVE, this.handlePan)
					.on(MOUSEUP, this.handlePanEnd);

			} else if (somethingSelected) {
				this.setState({
					panInProgress: false,
					dragInProgress: true,
					panStart: null,
					dragStartPosition: mouseXY,
				});
				this.props.onDragStart({ startPos: mouseXY }, e);
				// this.mouseInteraction = false;

				const win = d3Window(this.node);
				select(win)
					.on(MOUSEMOVE, this.handleDrag)
					.on(MOUSEUP, this.handleDragEnd);
			}

			onMouseDown(mouseXY, currentCharts, e);
		}
		e.preventDefault();
	}
	shouldPan() {
		const { pan: panEnabled, onPan } = this.props;
		return panEnabled
			&& onPan
			&& isDefined(this.state.panStart);
	}
	handlePan() {
		const e = d3Event;

		if (this.shouldPan()) {
			this.panHappened = true;

			const { panStartXScale, panOrigin, chartsToPan } = this.state.panStart;

			const mouseXY = this.mouseInteraction
				? mouse(this.node)
				: touches(this.node)[0];

			this.lastNewPos = mouseXY;
			const dx = mouseXY[0] - panOrigin[0];
			const dy = mouseXY[1] - panOrigin[1];

			this.dx = dx;
			this.dy = dy;

			this.props.onPan(
				mouseXY, panStartXScale, { dx, dy }, chartsToPan, e
			);
		}
	}
	handlePanEnd() {
		const e = d3Event;
		const { pan: panEnabled, onPanEnd } = this.props;

		if (isDefined(this.state.panStart)) {
			const { panStartXScale, chartsToPan } = this.state.panStart;

			const win = d3Window(this.node);
			select(win)
				.on(MOUSEMOVE, this.mouseInside ? this.handleMouseMove : null)
				.on(MOUSEUP, null)
				.on(TOUCHMOVE, null)
				.on(TOUCHEND, null);

			if (this.panHappened
					// && !this.contextMenuClicked
					&& panEnabled
					&& onPanEnd) {
				const { dx, dy } = this;

				// console.log(dx, dy)
				delete this.dx;
				delete this.dy;
				onPanEnd(this.lastNewPos, panStartXScale, { dx, dy }, chartsToPan, e);
			}

			this.setState({
				panInProgress: false,
				panStart: null,
			});
		}
	}
	handleTouchStart(e) {
		this.mouseInteraction = false;

		const { pan: panEnabled, chartConfig, onMouseMove } = this.props;
		const { xScale, onPanEnd } = this.props;

		if (e.touches.length === 1) {

			this.panHappened = false;
			const touchXY = touchPosition(getTouchProps(e.touches[0]), e);
			// onMouseMove(touchXY, "touch", e);
			if (panEnabled) {
				const currentCharts = getCurrentCharts(chartConfig, touchXY);

				this.setState({
					panInProgress: true,
					panStart: {
						panStartXScale: xScale,
						panOrigin: touchXY,
						chartsToPan: currentCharts,
					}
				});

				onMouseMove(touchXY, "touch", e);

				const win = d3Window(this.node);
				select(win)
					.on(TOUCHMOVE, this.handlePan, false)
					.on(TOUCHEND, this.handlePanEnd, false);

			}
		} else if (e.touches.length === 2) {
			// pinch zoom begin
			// do nothing pinch zoom is handled in handleTouchMove
			const { panInProgress, panStart } = this.state;

			if (panInProgress && panEnabled && onPanEnd) {
				const { panStartXScale, panOrigin, chartsToPan } = panStart;

				const win = d3Window(this.node);
				select(win)
					.on(MOUSEMOVE, this.mouseInside ? this.handleMouseMove : null)
					.on(MOUSEUP, null)
					.on(TOUCHMOVE, this.handlePinchZoom, false)
					.on(TOUCHEND, this.handlePinchZoomEnd, false);

				const touch1Pos = touchPosition(getTouchProps(e.touches[0]), e);
				const touch2Pos = touchPosition(getTouchProps(e.touches[1]), e);

				if (this.panHappened
						// && !this.contextMenuClicked
						&& panEnabled
						&& onPanEnd) {

					onPanEnd(this.lastNewPos, panStartXScale, panOrigin, chartsToPan, e);
				}

				this.setState({
					panInProgress: false,
					pinchZoomStart: {
						xScale,
						touch1Pos,
						touch2Pos,
						range: xScale.range(),
						chartsToPan,
					}
				});
			}
		}
	}
	handlePinchZoom() {
		const e = d3Event;
		const [touch1Pos, touch2Pos] = touches(this.node);
		const { xScale, zoom: zoomEnabled, onPinchZoom } = this.props;

		// eslint-disable-next-line no-unused-vars
		const { chartsToPan, ...initialPinch } = this.state.pinchZoomStart;

		if (zoomEnabled && onPinchZoom) {
			onPinchZoom(initialPinch, {
				touch1Pos,
				touch2Pos,
				xScale,
			}, e);
		}
	}
	handlePinchZoomEnd() {
		const e = d3Event;

		const win = d3Window(this.node);
		select(win)
			.on(TOUCHMOVE, null)
			.on(TOUCHEND, null);

		const { zoom: zoomEnabled, onPinchZoomEnd } = this.props;

		// eslint-disable-next-line no-unused-vars
		const { chartsToPan, ...initialPinch } = this.state.pinchZoomStart;

		if (zoomEnabled && onPinchZoomEnd) {
			onPinchZoomEnd(initialPinch, e);
		}

		this.setState({
			pinchZoomStart: null
		});
	}
	setCursorClass(cursorOverrideClass) {
		if (cursorOverrideClass !== this.state.cursorOverrideClass) {
			this.setState({
				cursorOverrideClass
			});
		}
	}
	render() {
		const { height, width, disableInteraction } = this.props;
		const className = this.state.cursorOverrideClass != null
			? this.state.cursorOverrideClass
			: this.state.panInProgress
				? "react-stockcharts-grabbing-cursor"
				: "react-stockcharts-crosshair-cursor";

		const interactionProps = disableInteraction || {
			onWheel: this.handleWheel,
			onMouseDown: this.handleMouseDown,
			onClick: this.handleClick,
			onContextMenu: this.handleContextMenu,
			onTouchStart: this.handleTouchStart,
		};

		return (
			<rect ref={this.saveNode}
				className={className}
				width={width}
				height={height}
				style={{ opacity: 0 }}
				{...interactionProps}
			/>
		);
	}
}

// 				onMouseEnter={this.handleEnter}
//				onMouseLeave={this.handleLeave}


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
	disableInteraction: PropTypes.bool.isRequired,

	getAllPanConditions: PropTypes.func.isRequired,

	onMouseMove: PropTypes.func,
	onMouseEnter: PropTypes.func,
	onMouseLeave: PropTypes.func,
	onZoom: PropTypes.func,
	onPinchZoom: PropTypes.func,
	onPinchZoomEnd: PropTypes.func.isRequired,
	onPan: PropTypes.func,
	onPanEnd: PropTypes.func,
	onDragStart: PropTypes.func,
	onDrag: PropTypes.func,
	onDragComplete: PropTypes.func,

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
	onDragComplete: noop,
	disableInteraction: false,
};

export default EventCapture;
