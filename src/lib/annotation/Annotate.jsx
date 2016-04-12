"use strict";

import React, { PropTypes, Component } from "react";

import pure from "../pure";
import wrap from "../series/wrap";
import { isDefined } from "../utils";

class Annotate extends Component {
	render() {
		var { className, chartConfig, xScale, xAccessor, plotData, usingProps, with: Annotation } = this.props;
		var { yScale } = chartConfig;
		var data = helper(this.props, plotData);

		return (
			<g className={className}>
				{data.map(d => <Annotation key={d.idx}
						{...usingProps}
						xScale={xScale} yScale={yScale}
						xAccessor={xAccessor}
						datum={d} />)}
			</g>
		);
	}
}

Annotate.propTypes = {
	with: PropTypes.func,
	when: PropTypes.func,
	usingProps: PropTypes.object,
};

Annotate.defaultProps = {
	className: "react-stockcharts-Annotate",
};

function helper({ when }, plotData) {
	return plotData.filter(when);
}

Annotate.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {
	var data = helper(props, plotData);
	var { className, xAccessor, usingProps, with: Annotation } = props;

	var p = {
		...Annotation.defaultProps,
		...usingProps,
		xScale,
		yScale,
		xAccessor
	};

	data.forEach(d => {
		Annotation.drawOnCanvas({ ...p, datum: d }, ctx);
	});
};

export default wrap(Annotate);
