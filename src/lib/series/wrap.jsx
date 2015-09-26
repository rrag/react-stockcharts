"use strict";

import React from "react";
import objectAssign from "object-assign";

function getDisplayName(Series) {
	var name = Series.displayName || Series.name || "Series";
	return name;
}

function wrap(WrappedSeries) {
	class BaseCanvasSeries extends React.Component {
		componentDidMount() {
			var callback = WrappedSeries.drawOnCanvas;
			if (callback) {
				var { type } = this.props;
				var { getCanvasContexts } = this.context;

				if (type !== "svg" && getCanvasContexts !== undefined) {
					var contexts = getCanvasContexts();
					if (contexts) BaseCanvasSeries.baseReStockDrawOnCanvasHelper(contexts.axes, this.context, this.props, callback);
				}
			}
		}
		componentDidUpdate() {
			this.componentDidMount();
		}
		componentWillMount() {
			this.componentWillReceiveProps(this.props, this.context);
		}
		componentWillReceiveProps(nextProps, nextContext) {
			var callback = WrappedSeries.drawOnCanvas;
			if (callback) {
				var { canvasOrigin, height, width, compareSeries, indicator, xAccessor, yAccessor, seriesId, chartId } = nextContext;
				var draw = BaseCanvasSeries.baseReStockDrawOnCanvas.bind(null, nextProps, callback, canvasOrigin, height, width, compareSeries, indicator, xAccessor, yAccessor);

				nextContext.secretToSuperFastCanvasDraw.push({
					chartId: chartId,
					seriesId: seriesId,
					draw: draw,
				});
			}
		}
		render() {
			var { type, height, width, compareSeries, indicator, xAccessor, yAccessor, xScale, yScale, plotData, stroke, fill } = this.context;

			var callback = WrappedSeries.drawOnCanvas;

			if (type !== "svg" && callback !== undefined) return null;
			return <WrappedSeries ref="wrappedSeries"
				type={type}
				height={height} width={width}
				compareSeries={compareSeries}
				indicator={indicator}
				xAccessor={xAccessor} yAccessor={yAccessor}
				xScale={xScale} yScale={yScale}
				stroke={stroke} fill={fill}
				plotData={plotData}
				{...this.props} />;
		}
	};

	BaseCanvasSeries.displayName = `wrap(${ getDisplayName(WrappedSeries) })`;

	BaseCanvasSeries.contextTypes = {
		getCanvasContexts: React.PropTypes.func,
		canvasOrigin: React.PropTypes.array,
		height: React.PropTypes.number.isRequired,
		width: React.PropTypes.number.isRequired,
		secretToSuperFastCanvasDraw: React.PropTypes.array.isRequired,
		chartId: React.PropTypes.number.isRequired,
		seriesId: React.PropTypes.number.isRequired,
		stroke: React.PropTypes.string,
		fill: React.PropTypes.string,

		type: React.PropTypes.string,
		indicator: React.PropTypes.func,
		xScale: React.PropTypes.func.isRequired,
		yScale: React.PropTypes.func.isRequired,
		xAccessor: React.PropTypes.func.isRequired,
		yAccessor: React.PropTypes.func.isRequired,
		compareSeries: React.PropTypes.array.isRequired,
		plotData: React.PropTypes.array.isRequired,
	};

	BaseCanvasSeries.baseReStockDrawOnCanvasHelper = (canvasContext, context, props, callback) => {
		var { height, width, compareSeries, indicator, xAccessor, yAccessor, xScale, yScale, plotData, canvasOrigin } = context;
		BaseCanvasSeries.baseReStockDrawOnCanvas(props, callback, canvasOrigin, height, width, compareSeries, indicator, xAccessor, yAccessor, canvasContext, xScale, yScale, plotData);
	};

	BaseCanvasSeries.baseReStockDrawOnCanvas = (props, callback, canvasOrigin, height, width, compareSeries, indicator, xAccessor, yAccessor, ctx, xScale, yScale, plotData) => {
		ctx.save();

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.translate(canvasOrigin[0], canvasOrigin[1]);

		ctx.beginPath();
		ctx.rect(-1, -1, width + 1, height + 1);
		ctx.clip();

		if (callback) {
			var newProps = objectAssign({}, { height, width, compareSeries, indicator, xAccessor, yAccessor }, props);
			callback(newProps, ctx, xScale, yScale, plotData);
		}

		ctx.restore();
	};

	Object.keys(WrappedSeries)
		// .filter((key) => key !== "propTypes")
		// .filter((key) => key !== "defaultProps")
		.filter(key => key !== "displayName")
		.filter(key => key !== "contextTypes")
		.filter(key => key !== "childContextTypes")
		.forEach(key => BaseCanvasSeries[key] = WrappedSeries[key]);

	// console.log(Object.keys(BaseCanvasSeries))
	return BaseCanvasSeries;
}

export default wrap;
