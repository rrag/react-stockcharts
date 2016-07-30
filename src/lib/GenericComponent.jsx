"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";
import { noop } from "./utils";

var suscriberId = 0;

class GenericComponent extends Component {
	constructor(props, context) {
		super(props, context);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
		this.getMoreProps = this.getMoreProps.bind(this);
		this.listener = this.listener.bind(this);
		this.draw = this.draw.bind(this);

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

		if (chartConfigList) {
			var { chartId } = this.context;
			var chartConfig = chartConfigList
				.filter(each => each.id === chartId)[0];
			this.moreProps.chartConfig = chartConfig
		}

		switch (type) {
			case "mouseenter": {
				break;
			}
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
		if (chartCanvasType === "svg") {
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

		if (chartCanvasType !== "svg") {
			this.drawOnCanvas();
		}
	}
	getMoreProps() {
		var { xScale, xAccessor, plotData, chartConfig } = this.context;

		var moreProps = {
			xScale, xAccessor, plotData, chartConfig,
			...this.moreProps
		}
		return moreProps;
	}
	drawOnCanvas() {
		var { canvasDraw, canvasToDraw } = this.props;
		var { getCanvasContexts } = this.context;

		var ctx = canvasToDraw(getCanvasContexts());

		var { canvasOriginX, canvasOriginY } = this.context;

		ctx.save();

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.translate(canvasOriginX, canvasOriginY);

		canvasDraw(ctx, this.getMoreProps());

		ctx.restore();
	}
	render() {
		var { chartCanvasType } = this.context;
		if (chartCanvasType !== "svg") return null;

		var { svgDraw } = this.props;

		return svgDraw(this.getMoreProps());
	}
}

GenericComponent.propTypes = {
	svgDraw: PropTypes.func.isRequired,
	canvasDraw: PropTypes.func.isRequired,
	drawOnMouseMove: PropTypes.bool.isRequired,
	drawOnPan: PropTypes.bool.isRequired,
};

GenericComponent.defaultProps = {
	svgDraw: d3.functor(null),
	canvasDraw: noop,
	drawOnMouseMove: false,
	drawOnPan: false,
	drawOnHover: false,
	drawOnMouseExitOfCanvas: false,
	canvasToDraw: contexts => contexts.mouseCoord
};

GenericComponent.contextTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	margin: PropTypes.object.isRequired,
	chartId: PropTypes.number.isRequired,
	getCanvasContexts: PropTypes.func,

	chartCanvasType: PropTypes.string,
	xScale: PropTypes.func.isRequired,
	xAccessor: PropTypes.func.isRequired,
	plotData: PropTypes.array.isRequired,
	chartConfig: PropTypes.object.isRequired,
	canvasOriginX: PropTypes.number,
	canvasOriginY: PropTypes.number,

	subscribe: PropTypes.func.isRequired,
	unsubscribe: PropTypes.func.isRequired,
};

export default GenericComponent;
