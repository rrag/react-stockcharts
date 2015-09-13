"use strict";

import React from "react";

class BaseCanvasSeries extends React.Component {
	componentDidUpdate(prevProps, prevState, prevContext) {
		if (this.props.type !== "svg" && this.context.canvasContext !== undefined) this.drawOnCanvas();
	}
	componentWillMount() {
		this.componentWillReceiveProps(this.props, this.context);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		var { canvasOrigin, compareSeries, indicator, xAccessor, yAccessor, seriesId, chartId } = nextContext;
		var draw = this.drawOnCanvasStatic.bind(this, nextProps, canvasOrigin, compareSeries, indicator, xAccessor, yAccessor);

		nextContext.secretToSuperFastCanvasDraw.push({
			chartId: chartId,
			seriesId: seriesId,
			draw: draw,
		});
	}
}

BaseCanvasSeries.contextTypes = {
	canvasContext: React.PropTypes.object,
	type: React.PropTypes.string,
	secretToSuperFastCanvasDraw: React.PropTypes.array.isRequired,
	chartId: React.PropTypes.number.isRequired,
	seriesId: React.PropTypes.number.isRequired,
	canvasOrigin: React.PropTypes.array,

	indicator: React.PropTypes.func,
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	yAccessor: React.PropTypes.func.isRequired,
	compareSeries: React.PropTypes.array.isRequired,
	plotData: React.PropTypes.array.isRequired,
};

module.exports = BaseCanvasSeries;
