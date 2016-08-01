"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";
import { noop, isNotDefined, isDefined } from "./utils";

var suscriberId = 0;

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
		this.executeMouseMove = this.executeMouseMove.bind(this);

		this.suscriberId = suscriberId++;

		this.moreProps = {};
		this.state = {
			updateCount: 0,
		}
	}
	updateMoreProps(moreProps) {
		// console.log(type, moreProps, e)
		this.moreProps = Object.assign(this.moreProps, moreProps);
	}
	listener(type, moreProps, e) {
		this.updateMoreProps(moreProps);
		this.evaluateType(type, e)
	}
	executeMouseMove(e) {
		this.moreProps.hovering = this.isHover(e)
		// console.log(this.moreProps.prevHovering, this.moreProps.hovering)
		if (this.moreProps.hovering
				|| (this.moreProps.prevHovering && !this.moreProps.hovering)
				|| this.props.drawOnMouseMove) {
			this.draw();
		}
		this.moreProps.prevHovering = this.moreProps.hovering;
	}
	evaluateType(type, e) {
		switch (type) {
			case "zoom":
			case "mouseenter":
				// DO NOT DRAW FOR THESE EVENTS
				break;
			case "click": {
				if (this.moreProps.hovering && this.props.onClick) {
					this.props.onClick(e);
				}
				break;
			}
			case "mousemove": {
				this.executeMouseMove();
				break;
			}
			case "dblclick": {
				if (this.moreProps.hovering && this.props.onDoubleClick) {
					this.props.onDoubleClick(e);
				}
				break;
			}
			case "mouseleave": {
				if (this.props.drawOnMouseExitOfCanvas) {
					this.draw();
				}
				break;
			}
			case "pan": {
				if (this.props.drawOnPan) {
					// console.log("HERE", this.moreProps)
					this.draw();
				}
				break;
			}
		}
		if (type !== "mousemove" && type !== "click") this.moreProps.prevHovering = false;
	}
	isHover(e) {
		return this.props.isHover(this.moreProps, e);
	}
	draw(hovering = false) {
		var { chartCanvasType } = this.context;
		var { canvasDraw } = this.props;

		if (isNotDefined(canvasDraw) || chartCanvasType === "svg") {
			var { updateCount } = this.state;

			this.setState({
				updateCount: updateCount + 1,
			})
		} else if (!(this.moreProps.prevHovering && !this.moreProps.hovering)) {
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
		this.componentDidUpdate()
	}
	componentDidUpdate() {
		var { chartCanvasType } = this.context;
		var { canvasDraw } = this.props;

		if (isDefined(canvasDraw) && chartCanvasType !== "svg") {
			this.drawOnCanvas();
		}
	}
	componentWillReceiveProps(nextProps, nextContext) {
		var { xScale, plotData, chartConfig } = nextContext;
		this.moreProps = {
			...this.moreProps,
			xScale, plotData, chartConfig
		}
	}
	getMoreProps() {
		var { xScale, plotData, chartConfig } = this.context;

		var moreProps = {
			xScale, plotData, chartConfig,
			...this.moreProps
		}
		return moreProps;
	}
	drawOnCanvas() {
		var { canvasDraw, canvasToDraw, hoverCanvasToDraw, clip } = this.props;
		var { getCanvasContexts, width, height } = this.context;
		var { hovering } = this.moreProps;

		var ctx = hovering
			? hoverCanvasToDraw(getCanvasContexts())
			: canvasToDraw(getCanvasContexts());

		var { canvasOriginX, canvasOriginY } = this.context;

		ctx.save();

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.translate(canvasOriginX, canvasOriginY);

		if (clip) {
			ctx.beginPath();
			ctx.rect(-1, -1, width + 1, height + 1);
			ctx.clip();
		}
		canvasDraw(ctx, this.getMoreProps());

		ctx.restore();
	}
	render() {
		var { chartCanvasType } = this.context;
		var { canvasDraw, clip, svgDraw } = this.props;

		if (isDefined(canvasDraw) && chartCanvasType !== "svg") return null;

		var style = clip ? { "clipPath": "url(#chart-area-clip)" } : null;

		return <g style={style}>{svgDraw(this.getMoreProps())}</g>;
	}
}

GenericComponent.propTypes = {
	svgDraw: PropTypes.func.isRequired,
	canvasDraw: PropTypes.func,
	drawOnMouseMove: PropTypes.bool.isRequired,
	drawOnPan: PropTypes.bool.isRequired,
};

GenericComponent.defaultProps = {
	svgDraw: d3.functor(null),
	drawOnMouseMove: false,
	drawOnPan: false,
	drawOnHover: false,
	drawOnMouseExitOfCanvas: false,
	canvasToDraw: contexts => contexts.mouseCoord,
	hoverCanvasToDraw: contexts => contexts.mouseCoord,
	clip: true,
	isHover: d3.functor(false),
};

GenericComponent.contextTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	margin: PropTypes.object.isRequired,
	// chartId: PropTypes.number.isRequired,
	getCanvasContexts: PropTypes.func,

	chartCanvasType: PropTypes.string,
	xScale: PropTypes.func.isRequired,
	xAccessor: PropTypes.func.isRequired,
	plotData: PropTypes.array.isRequired,
	// chartConfig: PropTypes.object.isRequired,
	canvasOriginX: PropTypes.number,
	canvasOriginY: PropTypes.number,

	subscribe: PropTypes.func.isRequired,
	unsubscribe: PropTypes.func.isRequired,
};

export default GenericComponent;
