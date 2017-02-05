"use strict";

import { PropTypes } from "react";

import GenericComponent from "./GenericComponent";

class GenericChartComponent extends GenericComponent {
	constructor(props, context) {
		super(props, context);

		this.preCanvasDraw = this.preCanvasDraw.bind(this);
		this.postCanvasDraw = this.postCanvasDraw.bind(this);
	}
	preCanvasDraw(ctx, moreProps) {
		super.preCanvasDraw(ctx, moreProps);
		ctx.save();
		const { margin, ratio } = this.context;
		const { chartConfig } = moreProps;

		const canvasOriginX = (0.5 * ratio) + chartConfig.origin[0] + margin.left;
		const canvasOriginY = (0.5 * ratio) + chartConfig.origin[1] + margin.top;

		const { chartConfig: { width, height } } = moreProps;
		const { clip, edgeClip } = this.props;

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.scale(ratio, ratio);
		if (edgeClip) {
			ctx.beginPath();
			ctx.rect(-1, canvasOriginY - 10, width + margin.left + margin.right + 1, height + 20);
			ctx.clip();
		}

		ctx.translate(canvasOriginX, canvasOriginY);

		if (clip) {
			ctx.beginPath();
			ctx.rect(-1, -1, width + 1, height + 1);
			ctx.clip();
		}
	}
	postCanvasDraw(ctx, moreProps) {
		super.postCanvasDraw(ctx, moreProps);
		ctx.restore();
	}
	updateMoreProps(moreProps) {
		super.updateMoreProps(moreProps);
		const { chartConfig: chartConfigList } = moreProps;

		if (chartConfigList) {
			const { chartId } = this.context;
			const chartConfig = chartConfigList
				.filter(each => each.id === chartId)[0];
			this.moreProps.chartConfig = chartConfig;
		}
	}
}

GenericChartComponent.propTypes = GenericComponent.propTypes;

GenericChartComponent.defaultProps = GenericComponent.defaultProps;

GenericChartComponent.contextTypes = {
	...GenericComponent.contextTypes,
	canvasOriginX: PropTypes.number,
	canvasOriginY: PropTypes.number,
	chartId: PropTypes.number.isRequired,
	chartConfig: PropTypes.object.isRequired,
	ratio: PropTypes.number.isRequired,
};

export default GenericChartComponent;
