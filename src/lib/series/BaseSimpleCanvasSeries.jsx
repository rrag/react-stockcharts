"use strict";

import React from "react";

class BaseSimpleCanvasSeries extends React.Component {
	componentDidUpdate(prevProps, prevState, prevContext) {
		if (this.context.type !== "svg" && this.context.canvasContext !== undefined) this.drawOnCanvas();
	}
	componentWillMount() {
		this.componentWillReceiveProps(this.props, this.context);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		var { canvasOrigin, compareSeries, indicator, xAccessor, yAccessor, seriesId, chartId } = nextContext;
		var draw = this.drawOnCanvasStatic.bind(this, nextProps, canvasOrigin);

		nextContext.secretToSuperFastCanvasDraw.push({
			chartId: chartId,
			seriesId: seriesId,
			draw: draw,
		});
	}
}

BaseSimpleCanvasSeries.contextTypes = {
	canvasContext: React.PropTypes.object,
	secretToSuperFastCanvasDraw: React.PropTypes.array.isRequired,
	chartId: React.PropTypes.number.isRequired,
	seriesId: React.PropTypes.number.isRequired,
	canvasOrigin: React.PropTypes.array,
};

module.exports = BaseSimpleCanvasSeries;
