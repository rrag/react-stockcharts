"use strict";

import React, { PropTypes, Component } from "react";
import { isNotDefined, isDefined, noop, functor, identity } from "./utils";

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

		var { generateSubscriptionId } = context;
		this.suscriberId = generateSubscriptionId();

		this.moreProps = {};
		this.prevHovering = false;
		this.prevMouseXY = null;
		this.drawOnNextTick = false;
		this.state = {
			updateCount: 0,
		};
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
			if (this.moreProps.hovering && this.props.onMouseDown) {
				this.props.onMouseDown(e);
			}
			break;
		}
		case "click": {
			if (this.moreProps.hovering && this.props.onClick) {
				this.props.onClick(e);
			}
			break;
		}
		case "mousemove": {
			this.moreProps.hovering = this.isHover(e);

			if (this.prevHovering !== this.moreProps.hovering
					|| this.moreProps.hovering
					|| this.props.drawOnMouseMove) {
				if (this.props.onMouseMove) this.props.onMouseMove(e);
				this.drawOnNextTick = true;
			} else {
				this.drawOnNextTick = false;
			}

			this.prevMouseXY = this.moreProps.mouseXY;
			this.prevHovering = this.moreProps.hovering;
			break;
		}
		case "dblclick": {
			if (this.moreProps.hovering && this.props.onDoubleClick) {
				this.props.onDoubleClick(e);
			}
			break;
		}
		case "mouseleave": {
			this.drawOnNextTick = this.props.drawOnMouseExitOfCanvas;
			break;
		}
		case "pan": {
			this.moreProps.hovering = false;
			this.drawOnNextTick = this.props.drawOnPan;
			break;
		}
		case "draw": {
			if (this.drawOnNextTick) {
				this.draw();
			}
			break;
		}
		}

		// if (type !== "mousemove" && type !== "ff") this.moreProps.prevHovering = false;
	}
	isHover(e) {
		return this.props.isHover(this.getMoreProps(), e);
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
		subscribe(this.suscriberId, this.listener);
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

		if (isDefined(canvasDraw) && chartCanvasType !== "svg") {
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
		// do nothing
	}
	drawOnCanvas() {
		var { canvasDraw, canvasToDraw, hoverCanvasToDraw } = this.props;
		var { getCanvasContexts } = this.context;

		var moreProps = this.getMoreProps();

		var { hovering } = moreProps;

		var ctx = hovering
			? hoverCanvasToDraw(getCanvasContexts())
			: canvasToDraw(getCanvasContexts());

		this.preCanvasDraw(ctx, moreProps);
		canvasDraw(ctx, moreProps);
		this.postCanvasDraw(ctx, moreProps);
	}
	render() {
		var { chartCanvasType, chartId } = this.context;
		var { canvasDraw, clip, svgDraw } = this.props;

		if (isDefined(canvasDraw) && chartCanvasType !== "svg") return null;

		var suffix = isDefined(chartId) ? "-" + chartId : "";

		var style = clip ? { "clipPath": `url(#chart-area-clip${suffix})` } : null;

		return <g style={style}>{svgDraw(this.getMoreProps())}</g>;
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
	canvasToDraw: PropTypes.func.isRequired,
	hoverCanvasToDraw: PropTypes.func.isRequired,
	isHover: PropTypes.func.isRequired,

	onClick: PropTypes.func,
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
	hoverCanvasToDraw: contexts => contexts.mouseCoord,
	clip: true,
	edgeClip: false,
	isHover: functor(false),
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

	subscribe: PropTypes.func.isRequired,
	unsubscribe: PropTypes.func.isRequired,
};

export default GenericComponent;
