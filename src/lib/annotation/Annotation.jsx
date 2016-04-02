"use strict";

import React, { PropTypes, Component } from "react";

import pure from "../pure";
import { isDefined } from "../utils";

class Annotation extends Component {
	render() {
		var { children, className, when } = this.props;
		var { chartConfig, xScale, xAccessor, plotData } = this.props;
		var { yScale } = chartConfig;
		return (
			<g className={className}>
				{plotData.filter(when).map(d => children({ d, xScale, yScale, xValue: xAccessor(d) }))}
			</g>
		);
	}
}

Annotation.propTypes = {
	className: PropTypes.string,
	children: PropTypes.func.isRequired,
};

Annotation.defaultProps = {
};

export default pure(Annotation, {
	// getCanvasContexts: PropTypes.func,
	// canvasOriginX: PropTypes.number,
	// canvasOriginY: PropTypes.number,
	// height: PropTypes.number.isRequired,
	// width: PropTypes.number.isRequired,
	// callbackForCanvasDraw: PropTypes.func.isRequired,
	// chartId: PropTypes.number.isRequired,
	// stroke: PropTypes.string,
	// fill: PropTypes.string,
	chartConfig: PropTypes.object.isRequired,
	chartCanvasType: PropTypes.string,
	xScale: PropTypes.func.isRequired,
	// yScale: PropTypes.func.isRequired,
	xAccessor: PropTypes.func.isRequired,
	plotData: PropTypes.array.isRequired,
});
