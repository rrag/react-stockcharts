"use strict";

import React from "react";

class BaseSimpleCanvasSeries extends React.Component {
	componentDidMount() {
		var { type } = this.props;
		var { getCanvasContexts } = this.context;

		if (type !== "svg" && getCanvasContexts !== undefined) {
			var contexts = getCanvasContexts();
			if (contexts) BaseSimpleCanvasSeries.drawOnCanvas(contexts.axes, this.context, this.props, this.getCanvasDraw());
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
		var draw = BaseSimpleCanvasSeries.drawModifiedStatic.bind(this, nextProps, this.getCanvasDraw(), canvasOrigin, height, width);

		nextContext.secretToSuperFastCanvasDraw.push({
			chartId: chartId,
			seriesId: seriesId,
			draw: draw,
		});
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

BaseSimpleCanvasSeries.drawOnCanvas = (ctx, context, props, callback) => {
	var { plotData, xScale, yScale } = props;
	var { canvasOrigin, height, width } = context;

	BaseSimpleCanvasSeries.drawModifiedStatic(props, callback, canvasOrigin, height, width, ctx, xScale, yScale, plotData);
};

BaseSimpleCanvasSeries.drawModifiedStatic = (props, callback, canvasOrigin, height, width, ctx, xScale, yScale, plotData) => {
	ctx.save();

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(canvasOrigin[0], canvasOrigin[1]);

	ctx.beginPath();
	ctx.rect(-1, -1, width, height);
	ctx.clip();

	callback(props, ctx, xScale, yScale, plotData);
	ctx.restore();
};

module.exports = BaseSimpleCanvasSeries;
