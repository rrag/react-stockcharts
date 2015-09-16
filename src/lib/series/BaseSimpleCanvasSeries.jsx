"use strict";

import React from "react";

class BaseSimpleCanvasSeries extends React.Component {
	constructor(props) {
		super(props);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	componentDidMount() {
		var { type } = this.props;
		var { getCanvasContexts } = this.context;

		if (type !== "svg" && getCanvasContexts !== undefined) {
			var contexts = getCanvasContexts();
			if (contexts) this.drawOnCanvas(contexts.axes);
		}
	}
	componentDidUpdate() {
		this.componentDidMount()
	}
	componentWillMount() {
		this.componentWillReceiveProps(this.props, this.context);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		var { canvasOrigin, height, width, chartId, seriesId } = nextContext;
		var draw = this.drawModifiedStatic.bind(this, nextProps, canvasOrigin, height, width);

		nextContext.secretToSuperFastCanvasDraw.push({
			chartId: chartId,
			seriesId: seriesId,
			draw: draw,
		});
	}
	drawOnCanvas(ctx) {
		var { plotData, xScale, yScale } = this.props;
		var { canvasOrigin, height, width } = this.context;

		this.drawModifiedStatic(this.props, canvasOrigin, height, width, ctx, xScale, yScale, plotData);
	}
	drawModifiedStatic(props, canvasOrigin, height, width, ctx, xScale, yScale, plotData) {
		ctx.save();

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.translate(canvasOrigin[0], canvasOrigin[1]);

		ctx.beginPath();
		ctx.rect(-1, -1, width, height);
		ctx.clip();

		this.drawOnCanvasStatic(props, ctx, xScale, yScale, plotData);
		ctx.restore();
	}
};

BaseSimpleCanvasSeries.contextTypes = {
	getCanvasContexts: React.PropTypes.func,
	secretToSuperFastCanvasDraw: React.PropTypes.array.isRequired,
	chartId: React.PropTypes.number.isRequired,
	seriesId: React.PropTypes.number.isRequired,
	canvasOrigin: React.PropTypes.array,
	height: React.PropTypes.number.isRequired,
	width: React.PropTypes.number.isRequired,

};

module.exports = BaseSimpleCanvasSeries;
