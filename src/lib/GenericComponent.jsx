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
		this.evaluateType = this.evaluateType.bind(this);

		this.suscriberId = suscriberId++;

		this.moreProps = {};
		this.state = {
			updateCount: 0,
		}
	}
	listener(type, moreProps, e) {
		// console.log(type, moreProps, e)
		var { chartConfig: chartConfigList } = moreProps;
		this.moreProps = Object.assign(this.moreProps, moreProps);

		this.evaluateType(type)
	}
	evaluateType(type) {
		switch (type) {
			case "zoom":
			case "mouseenter":
				// DO NOT DRAW FOR THESE EVENTS
				break;
			case "mousemove": {
				if (this.props.drawOnMouseMove) {
					this.draw();
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
	}
	draw() {
		var { chartCanvasType } = this.context;
		var { canvasDraw } = this.props;

		if (isNotDefined(canvasDraw) || chartCanvasType === "svg") {
			var { updateCount } = this.state;

			this.setState({
				updateCount: updateCount + 1,
			})
		} else {
			this.drawOnCanvas();
		}
	}
	componentWillMount() {
		var { subscribe } = this.context;
		subscribe(this.suscriberId, this.listener);
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
		var { canvasDraw, canvasToDraw, clip } = this.props;
		var { getCanvasContexts, width, height } = this.context;

		var ctx = canvasToDraw(getCanvasContexts());

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
	clip: true,
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
