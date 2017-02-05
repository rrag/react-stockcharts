"use strict";

import React, { PropTypes, Component } from "react";

import {
	isNotDefined,
	isDefined,
	noop,
	functor,
	identity,
} from "./utils";

const aliases = {
	// mouseleave: "mousemove",
	mousedown: "mousemove",
	click: "mousemove",
	dblclick: "mousemove",
	dragstart: "drag",
	dragend: "drag",
};

class GenericComponent extends Component {
	constructor(props, context) {
		super(props, context);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
		this.getMoreProps = this.getMoreProps.bind(this);
		this.listener = this.listener.bind(this);
		this.draw = this.draw.bind(this);
		this.updateMoreProps = this.updateMoreProps.bind(this);
		this.evaluateType = this.evaluateType.bind(this);
		this.isHover = this.isHover.bind(this);
		this.preCanvasDraw = this.preCanvasDraw.bind(this);
		this.postCanvasDraw = this.postCanvasDraw.bind(this);
		this.isDraggable = this.isDraggable.bind(this);

		const { generateSubscriptionId } = context;
		this.suscriberId = generateSubscriptionId();

		this.moreProps = {};

		this.state = {
			updateCount: 0,
		};
	}
	updateMoreProps(moreProps) {
		// this.prevMoreProps = this.moreProps;
		this.moreProps = Object.assign(this.moreProps, moreProps);
	}
	listener(type, moreProps, state, e) {
		// console.log(e.shiftKey)
		if (isDefined(moreProps)) {
			this.updateMoreProps(moreProps);
		}
		this.evaluationInProgress = true;
		this.evaluateType(type, e);
		this.evaluationInProgress = false;
	}
	evaluateType(type, e) {
		const newType = aliases[type] || type;
		const proceed = this.props.drawOn.indexOf(newType) > -1;

		// console.log("type ->", type, proceed);
		if (!proceed) return;

		switch (type) {
		case "zoom":
		case "mouseleave": {
			/*
			const drawOnMouseExitOfCanvas = this.props.drawOn.indexOf(type) > -1;

			// when you move the mouse fast enough, that mouseleave
			// is triggered before the draw after mousemove is triggered
			// This or condition below avoids having a blank hover
			// canvas
			this.drawOnNextTick = this.drawOnNextTick
				|| drawOnMouseExitOfCanvas;
			*/
			break;
		}
		case "mouseenter":
				// DO NOT DRAW FOR THESE EVENTS
			break;
		case "contextmenu": {
			if (this.moreProps.hovering && this.props.onContextMenu) {
				this.props.onContextMenu(this.getMoreProps(), e);
			}
			break;
		}
		case "mousedown": {
			if (this.moreProps.hovering) {
				if (this.props.onMouseDown) {
					this.props.onMouseDown(this.getMoreProps(), e);
				}
			}
			break;
		}
		case "click": {
			if (this.moreProps.hovering) {
				this.props.onClick(this.getMoreProps(), e);
			} else {
				this.props.onClickOutside(this.getMoreProps(), e);
			}
			break;
		}
		case "dragstart": {
			if (this.moreProps.hovering && this.props.selected) {
				const { amIOnTop } = this.context;
				if (amIOnTop(this.suscriberId)) {
					this.dragInProgress = true;
					this.props.onDragStart(this.getMoreProps(), e);
				}
			}
			this.someDragInProgress = true;
			break;
		}
		case "dragend": {
			if (this.dragInProgress && this.props.onDragComplete) {
				this.props.onDragComplete(this.getMoreProps(), e);
			}
			this.dragInProgress = false;
			this.someDragInProgress = false;
			break;
		}
		case "drag": {
			if (this.dragInProgress && this.props.onDrag) {
				this.props.onDrag(this.getMoreProps(), e);
			}
			break;
		}
		case "mousemove": {
			/*
			const drawOnMouseMove = this.props.drawOn.indexOf(type) > -1;
			this.drawOnNextTick = drawOnMouseMove
				|| isDefined(this.props.isHover);
			*/

			const prevHover = this.moreProps.hovering;
			this.moreProps.hovering = this.isHover(e);

			const { amIOnTop, setCursorClass } = this.context;

			if (this.moreProps.hovering
					&& !this.props.selected
					&& !prevHover
					&& isDefined(this.props.onHover)) {
				setCursorClass("react-stockcharts-pointer-cursor");
				this.iSetTheCursorClass = true;
			} else if (this.moreProps.hovering
					&& this.props.selected
					&& amIOnTop(this.suscriberId)) {
				setCursorClass(this.props.interactiveCursorClass);
				this.iSetTheCursorClass = true;
			} else if (prevHover
					&& !this.moreProps.hovering
					&& this.iSetTheCursorClass) {
				this.iSetTheCursorClass = false;
				setCursorClass(null);
			}

			if (this.moreProps.hovering && !prevHover) {
				if (this.props.onHover) {
					this.props.onHover(this.getMoreProps(), e);
				}
			}
			if (prevHover && !this.moreProps.hovering) {
				if (this.props.onBlur) {
					this.props.onBlur(this.getMoreProps(), e);
				}
			}

			if (this.props.onMouseMove) {
				this.props.onMouseMove(this.getMoreProps(), e);
			}

			// prevMouseXY is used in interactive components
			this.moreProps.prevMouseXY = this.moreProps.mouseXY;

			break;
		}
		case "dblclick": {
			if (this.moreProps.hovering && this.props.onDoubleClick) {
				this.props.onDoubleClick(this.getMoreProps(), e);
			}
			break;
		}
		case "pan": {
			this.moreProps.hovering = false;
			/*
			const drawOnPan = this.props.drawOn.indexOf(type) > -1;
			this.drawOnNextTick = drawOnPan;
			*/
			break;
		}
		}
	}
	isHover(e) {
		return isDefined(this.props.isHover)
			? this.props.isHover(this.getMoreProps(), e)
			: false;
	}
	draw({ trigger, force } = { force: false }) {
		const type = aliases[trigger] || trigger;
		const proceed = this.props.drawOn.indexOf(type) > -1;

		if (proceed
			|| this.props.selected /* this is to draw as soon as you select */
			|| force
			) {
			const { chartCanvasType } = this.context;
			const { canvasDraw } = this.props;

			if (isNotDefined(canvasDraw) || chartCanvasType === "svg") {
				const { updateCount } = this.state;
				this.setState({
					updateCount: updateCount + 1,
				});
			} else {
				this.drawOnCanvas();
			}
		}
	}
	componentWillMount() {
		const { subscribe, chartId } = this.context;
		const { clip, edgeClip } = this.props;

		subscribe(this.suscriberId,
			{
				chartId, clip, edgeClip,
				listener: this.listener,
				draw: this.draw,
				isDraggable: this.isDraggable,
			}
		);
		this.componentWillReceiveProps(this.props, this.context);
	}
	componentWillUnmount() {
		const { unsubscribe } = this.context;
		unsubscribe(this.suscriberId);
	}
	componentDidMount() {
		this.componentDidUpdate(this.props);
	}
	componentDidUpdate(prevProps) {
		const { chartCanvasType } = this.context;
		const { canvasDraw, selected, interactiveCursorClass } = this.props;

		if (prevProps.selected !== selected) {
			const { setCursorClass } = this.context;
			setCursorClass((selected && this.moreProps.hovering)
				? interactiveCursorClass
				: null);
		}
		if (isDefined(canvasDraw)
				&& !this.evaluationInProgress
				// && !(this.someDragInProgress && this.props.selected)
				/*
				prevent double draw of interactive elements
				during dragging / hover / click etc.
				*/
				&& chartCanvasType !== "svg") {
			this.drawOnCanvas();
		}
	}
	componentWillReceiveProps(nextProps, nextContext) {
		const { xScale, plotData, chartConfig } = nextContext;
		this.props.debug(nextContext);
		this.moreProps = {
			...this.moreProps,
			xScale, plotData, chartConfig
		};
	}
	isDraggable() {
		const draggable = this.props.selected
			&& this.moreProps.hovering;

		return draggable;
	}
	getMoreProps() {
		const { xScale, plotData, chartConfig, morePropsDecorator, xAccessor, displayXAccessor, width, height } = this.context;
		const { chartId, fullData } = this.context;

		const moreProps = {
			xScale, plotData, chartConfig,
			xAccessor, displayXAccessor,
			width, height,
			chartId,
			fullData,
			...this.moreProps
		};

		return (morePropsDecorator || identity)(moreProps);
	}
	preCanvasDraw() {
		// do nothing
	}
	postCanvasDraw() {
	}
	drawOnCanvas() {
		const { canvasDraw, canvasToDraw } = this.props;
		const { getCanvasContexts } = this.context;

		const moreProps = this.getMoreProps();

		const ctx = canvasToDraw(getCanvasContexts());

		this.preCanvasDraw(ctx, moreProps);
		canvasDraw(ctx, moreProps);
		this.postCanvasDraw(ctx, moreProps);
	}
	render() {
		const { chartCanvasType, chartId } = this.context;
		const { canvasDraw, clip, svgDraw } = this.props;

		if (isDefined(canvasDraw) && chartCanvasType !== "svg") {
			return null;
		}

		const suffix = isDefined(chartId) ? "-" + chartId : "";

		const style = clip ? { "clipPath": `url(#chart-area-clip${suffix})` } : null;

		return <g style={style}>{svgDraw(this.getMoreProps())}</g>;
	}
}

GenericComponent.propTypes = {
	svgDraw: PropTypes.func.isRequired,
	canvasDraw: PropTypes.func,

	drawOn: PropTypes.array.isRequired,

	clip: PropTypes.bool.isRequired,
	edgeClip: PropTypes.bool.isRequired,
	interactiveCursorClass: PropTypes.string,

	selected: PropTypes.bool.isRequired,

	canvasToDraw: PropTypes.func.isRequired,

	isHover: PropTypes.func,

	onClick: PropTypes.func,
	onClickOutside: PropTypes.func,

	onDragStart: PropTypes.func,
	onDrag: PropTypes.func,
	onDragComplete: PropTypes.func,
	onDoubleClick: PropTypes.func,
	onContextMenu: PropTypes.func,
	onMouseMove: PropTypes.func,
	onMouseDown: PropTypes.func,
	onHover: PropTypes.func,
	onBlur: PropTypes.func,

	debug: PropTypes.func,
	// owner: PropTypes.string.isRequired,
};

GenericComponent.defaultProps = {
	svgDraw: functor(null),
	draw: [],
	canvasToDraw: contexts => contexts.mouseCoord,
	clip: true,
	edgeClip: false,
	selected: false,

	onClickOutside: noop,
	onClick: noop,
	onDragStart: noop,
	onMouseMove: noop,
	onMouseDown: noop,
	debug: noop,
};

GenericComponent.childContextTypes = {
	morePropsDecorator: PropTypes.func,
};

GenericComponent.contextTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	margin: PropTypes.object.isRequired,
	chartId: PropTypes.number,
	getCanvasContexts: PropTypes.func,

	chartCanvasType: PropTypes.string,
	xScale: PropTypes.func.isRequired,
	xAccessor: PropTypes.func.isRequired,
	displayXAccessor: PropTypes.func.isRequired,
	plotData: PropTypes.array.isRequired,
	fullData: PropTypes.array.isRequired,

	chartConfig: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
	]).isRequired,

	morePropsDecorator: PropTypes.func,
	generateSubscriptionId: PropTypes.func,

	amIOnTop: PropTypes.func.isRequired,
	subscribe: PropTypes.func.isRequired,
	unsubscribe: PropTypes.func.isRequired,
	setCursorClass: PropTypes.func.isRequired,
};

export default GenericComponent;

export function getAxisCanvas(contexts) {
	return contexts.axes;
}

export function getMouseCanvas(contexts) {
	return contexts.mouseCoord;
}

export function getInteractiveCanvas(contexts) {
	return contexts.hover;
}
