"use strict";

import React, { PropTypes, Component } from "react";

import pure from "../pure";
import { isDefined } from "../utils"

function getDisplayName(Series) {
	var name = Series.displayName || Series.name || "Series";
	return name;
}

function wrap(WrappedSeries) {
	class BaseCanvasSeries extends Component {
		componentDidMount() {
			var callback = WrappedSeries.drawOnCanvas;
			if (callback) {
				var { chartCanvasType } = this.context;
				var { getCanvasContexts } = this.props;

				if (chartCanvasType !== "svg" && isDefined(getCanvasContexts)) {
					var contexts = getCanvasContexts();
					var props = { ...WrappedSeries.defaultProps, ...this.props };
					if (contexts) BaseCanvasSeries.baseReStockDrawOnCanvasHelper(contexts.axes, props, callback);
				}
			}
		}
		componentDidUpdate() {
			this.componentDidMount();
		}
		componentWillMount() {
			this.componentWillReceiveProps(this.props);
		}
		componentWillReceiveProps(nextProps) {
			// console.log("HERE1");

			var callback = WrappedSeries.drawOnCanvas;
			if (callback) {
				var { canvasOriginX, canvasOriginY, height, width, compareSeries,
					indicator, xAccessor, yAccessor, chartId } = nextProps;
				var canvasOrigin = [canvasOriginX, canvasOriginY];

				var props = { ...WrappedSeries.defaultProps, ...nextProps };

				var draw = BaseCanvasSeries.baseReStockDrawOnCanvas.bind(null, props, callback, canvasOrigin, height, width, compareSeries, indicator, xAccessor, yAccessor);

				nextProps.callbackForCanvasDraw({
					chartId: chartId,
					type: "series",
					// seriesId: seriesId,
					draw: draw,
				});
			}
		}
		render() {
			var callback = WrappedSeries.drawOnCanvas;
			var { clip, chartCanvasType, chartConfig } = this.props;

			if (chartCanvasType !== "svg" && isDefined(callback)) return null;
			var style = clip ? { "clipPath": "url(#chart-area-clip)" } : null;

			return (
				<g style={style}>
					<WrappedSeries ref="wrappedSeries"
						{...this.props} yScale={chartConfig.yScale} />
				</g>
			);
		}
	};

	BaseCanvasSeries.displayName = `wrap(${ getDisplayName(WrappedSeries) })`;

	BaseCanvasSeries.baseReStockDrawOnCanvasHelper = (canvasContext, props, callback) => {
		var { height, width, compareSeries, indicator, xAccessor, yAccessor,
			xScale, chartConfig, plotData, canvasOriginX, canvasOriginY } = props;
		var canvasOrigin = [canvasOriginX, canvasOriginY];

		BaseCanvasSeries.baseReStockDrawOnCanvas(props, callback, canvasOrigin, height, width,
			compareSeries, indicator, xAccessor, yAccessor, canvasContext, xScale, chartConfig.yScale, plotData);
	};

	BaseCanvasSeries.baseReStockDrawOnCanvas = (props, callback,
			canvasOrigin, height, width, compareSeries, indicator,
			xAccessor, yAccessor, ctx, xScale, yScale, plotData) => {

		ctx.save();

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.translate(canvasOrigin[0], canvasOrigin[1]);

		if (props.clip) {
			ctx.beginPath();
			ctx.rect(-1, -1, width + 1, height + 1);
			ctx.clip();
		}

		// console.log(canvasOrigin, width, height);

		// console.log("HERE");
		if (callback) {
			var newProps = { height, width, compareSeries, indicator, xAccessor, yAccessor, ...props };
			callback(newProps, ctx, xScale, yScale, plotData);
		}

		ctx.restore();
	};

	BaseCanvasSeries.defaultProps = {
		...WrappedSeries.defaultProps,
		clip: true,
	}

	BaseCanvasSeries.propTypes = {
		getCanvasContexts: PropTypes.func,
		chartCanvasType: PropTypes.string,
		clip: PropTypes.bool.isRequired,
	};

	// console.log(Object.keys(BaseCanvasSeries))
	return pure(BaseCanvasSeries, {
		getCanvasContexts: PropTypes.func,
		canvasOriginX: PropTypes.number,
		canvasOriginY: PropTypes.number,
		height: PropTypes.number.isRequired,
		width: PropTypes.number.isRequired,
		callbackForCanvasDraw: PropTypes.func.isRequired,
		chartId: PropTypes.number.isRequired,
		// seriesId: PropTypes.number.isRequired,
		stroke: PropTypes.string,
		fill: PropTypes.string,
		chartConfig: PropTypes.object.isRequired,
		chartCanvasType: PropTypes.string,
		xScale: PropTypes.func.isRequired,
		// yScale: PropTypes.func.isRequired,
		xAccessor: PropTypes.func.isRequired,
		plotData: PropTypes.array.isRequired,
	});
}

export default wrap;
