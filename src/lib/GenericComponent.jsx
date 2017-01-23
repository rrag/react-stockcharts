"use strict";

import React, { PropTypes, Component } from "react";

import {
	isNotDefined,
	isDefined,
	noop,
	functor,
	identity,
} from "./utils";

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
		this.getRef = this.getRef.bind(this);
		this.isDraggable = this.isDraggable.bind(this);
		this.saveNode = this.saveNode.bind(this);

		var { generateSubscriptionId } = context;
		this.suscriberId = generateSubscriptionId();

		this.moreProps = {};
		this.prevMouseXY = null;
		this.drawOnNextTick = false;
		this.state = {
			updateCount: 0,
			selected: false,
		};
	}
	saveNode(node) {
		this.node = node;
	}
	getRef(ref) {
		return this.refs[ref];
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

		this.evaluateType(type, e);
	}
	evaluateType(type, e) {
		this.props.debug(type);

		switch (type) {
		case "zoom":
		case "mouseenter":
				// DO NOT DRAW FOR THESE EVENTS
			break;
		case "contextmenu": {
			if (this.moreProps.hovering && this.props.onContextMenu) {
				this.props.onContextMenu(e);
			}
			break;
		}
		case "mousedown": {
			if (this.moreProps.hovering) {
				if (this.props.onMouseDown) {
					this.props.onMouseDown(e);
				}
			}
			break;
		}
		case "click": {
			if (this.props.onSelect) {
				const selected = this.moreProps.hovering
					? !this.props.selected
					: false;

				this.props.onSelect({
					selected
				}, e);
			}
			if (this.moreProps.hovering && this.props.onClick) {
				this.props.onClick(e);
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
			break;
		}
		case "dragend": {
			if (this.dragInProgress && this.props.onDragComplete) {
				this.props.onDragComplete(this.getMoreProps(), e);
			}
			this.dragInProgress = false;
			break;
		}
		case "drag": {
			if (this.dragInProgress && this.props.onDrag) {
				this.props.onDrag(this.getMoreProps(), e);
			}
			break;
		}
		// eslint-disable-next-line no-fallthrough
		case "mousemove": {
			this.drawOnNextTick = this.props.drawOnMouseMove
				|| isDefined(this.props.isHover);

			this.moreProps.hovering = this.isHover(e);

			if (this.props.onMouseMove
					&& this.drawOnNextTick) {
				this.props.onMouseMove(e);
			}
			// prevMouseXY is used in interactive components
			this.prevMouseXY = this.moreProps.mouseXY;

			break;
		}
		case "dblclick": {
			if (this.moreProps.hovering && this.props.onDoubleClick) {
				this.props.onDoubleClick(e);
			}
			break;
		}
		case "mouseleave": {
			// when you move the mouse fast enough, that mouseleave
			// is triggered before the draw after mousemove is triggered
			// This or condition below avoids having a blank hover
			// canvas
			this.drawOnNextTick = this.drawOnNextTick
				|| this.props.drawOnMouseExitOfCanvas;
			break;
		}
		case "pan": {
			this.moreProps.hovering = false;
			this.drawOnNextTick = this.props.drawOnPan;
			break;
		}
		case "draw": {
			if (this.drawOnNextTick
					|| this.props.selected /* this is to draw as soon as you select */
					) {
				this.draw();
			}
			break;
		}
		}
	}
	isHover(e) {
		return isDefined(this.props.isHover)
			? this.props.isHover(this.getMoreProps(), e)
			: false;
	}
	draw() {
		var { chartCanvasType } = this.context;
		var { canvasDraw } = this.props;

		if (isNotDefined(canvasDraw) || chartCanvasType === "svg") {
			var { updateCount } = this.state;
			this.setState({
				updateCount: updateCount + 1,
			});
		} else {
			this.drawOnCanvas();
		}
	}
	componentWillMount() {
		var { subscribe } = this.context;
		subscribe(this.suscriberId, this.listener, {
			isDraggable: this.isDraggable,
		});
		this.componentWillReceiveProps(this.props, this.context);
	}
	componentWillUnmount() {
		var { unsubscribe } = this.context;
		unsubscribe(this.suscriberId);
	}
	componentDidMount() {
		this.componentDidUpdate();
	}
	componentDidUpdate() {
		var { chartCanvasType } = this.context;
		var { canvasDraw } = this.props;

		this.props.debug("updated");

		if (isDefined(canvasDraw)
				&& !this.props.selected // prevent double draw of interactive elements
				&& chartCanvasType !== "svg") {
			this.drawOnCanvas();
		}
	}
	componentWillReceiveProps(nextProps, nextContext) {
		var { xScale, plotData, chartConfig } = nextContext;
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
		var { xScale, plotData, chartConfig, morePropsDecorator, xAccessor, displayXAccessor, width, height } = this.context;
		var { chartId, fullData } = this.context;

		var moreProps = {
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
		var { canvasDraw, canvasToDraw } = this.props;
		var { getCanvasContexts } = this.context;

		var moreProps = this.getMoreProps();
		var extra = {
			hoverEnabled: isDefined(this.props.isHover)
		};

		var ctx = canvasToDraw(getCanvasContexts(), extra);

		this.preCanvasDraw(ctx, moreProps);
		canvasDraw(ctx, moreProps);
		this.postCanvasDraw(ctx, moreProps);
	}
	render() {
		var { chartCanvasType, chartId } = this.context;
		var { canvasDraw, clip, svgDraw } = this.props;

		if (isDefined(canvasDraw) && chartCanvasType !== "svg") {
			return <g ref={this.saveNode} />;
		}

		var suffix = isDefined(chartId) ? "-" + chartId : "";

		var style = clip ? { "clipPath": `url(#chart-area-clip${suffix})` } : null;

		return <g ref={this.saveNode} style={style}>{svgDraw(this.getMoreProps())}</g>;
	}
}

GenericComponent.propTypes = {
	svgDraw: PropTypes.func.isRequired,
	canvasDraw: PropTypes.func,
	drawOnMouseMove: PropTypes.bool.isRequired,
	drawOnPan: PropTypes.bool.isRequired,
	clip: PropTypes.bool.isRequired,
	edgeClip: PropTypes.bool.isRequired,
	drawOnMouseExitOfCanvas: PropTypes.bool.isRequired,

	selected: PropTypes.bool.isRequired,

	canvasToDraw: PropTypes.func.isRequired,

	isHover: PropTypes.func,

	onClick: PropTypes.func,
	onSelect: PropTypes.func,
	onDragStart: PropTypes.func,
	onDrag: PropTypes.func,
	onDragComplete: PropTypes.func,
	onDoubleClick: PropTypes.func,
	onContextMenu: PropTypes.func,
	onMouseMove: PropTypes.func,
	onMouseDown: PropTypes.func,

	debug: PropTypes.func,
};

GenericComponent.defaultProps = {
	svgDraw: functor(null),
	drawOnMouseMove: false,
	drawOnPan: false,
	drawOnHover: false,
	drawOnMouseExitOfCanvas: false,
	canvasToDraw: contexts => contexts.mouseCoord,
	clip: true,
	edgeClip: false,
	selected: false,
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
};

export default GenericComponent;
