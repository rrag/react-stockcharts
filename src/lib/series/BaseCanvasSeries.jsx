"use strict";

import React from "react";

class BaseCanvasSeries extends React.Component {
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
		var { canvasOrigin, height, width, compareSeries, indicator, xAccessor, yAccessor, seriesId, chartId } = nextContext;
		var callback = this.getCanvasDraw();
		var draw = BaseCanvasSeries.drawModifiedStatic.bind(null, nextProps, callback, canvasOrigin, height, width, compareSeries, indicator, xAccessor, yAccessor);

		nextContext.secretToSuperFastCanvasDraw.push({
			chartId: chartId,
			seriesId: seriesId,
			draw: draw,
		});
	}
	drawOnCanvas(ctx) {
		var callback = this.getCanvasDraw();
		var { height, width, compareSeries, indicator, xAccessor, yAccessor, xScale, yScale, plotData, canvasOrigin } = this.context;
		BaseCanvasSeries.drawModifiedStatic(this.props, callback, canvasOrigin, height, width, compareSeries, indicator, xAccessor, yAccessor, ctx, xScale, yScale, plotData);
	}

}

BaseCanvasSeries.contextTypes = {
	getCanvasContexts: React.PropTypes.func,
	canvasOrigin: React.PropTypes.array,
	height: React.PropTypes.number.isRequired,
	width: React.PropTypes.number.isRequired,
	secretToSuperFastCanvasDraw: React.PropTypes.array.isRequired,
	chartId: React.PropTypes.number.isRequired,

	type: React.PropTypes.string,
	seriesId: React.PropTypes.number.isRequired,
	indicator: React.PropTypes.func,
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	yAccessor: React.PropTypes.func.isRequired,
	compareSeries: React.PropTypes.array.isRequired,
	plotData: React.PropTypes.array.isRequired,
};

BaseCanvasSeries.drawModifiedStatic = (props, callback, canvasOrigin, height, width, compareSeries, indicator, xAccessor, yAccessor, ctx, xScale, yScale, plotData) => {
	ctx.save();

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(canvasOrigin[0], canvasOrigin[1]);

	ctx.beginPath();
	ctx.rect(-1, -1, width, height);
	ctx.clip();

	callback(props, canvasOrigin, height, width, compareSeries, indicator, xAccessor, yAccessor, ctx, xScale, yScale, plotData);
	ctx.restore();
}

module.exports = BaseCanvasSeries;
