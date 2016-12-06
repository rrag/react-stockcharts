"use strict";

import React, { PropTypes, Component } from "react";

import GenericChartComponent from "../GenericChartComponent";

class Annotate extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
	}
	render() {
		return <GenericChartComponent
			svgDraw={this.renderSVG}
			drawOnPan
			/>;
	}
	renderSVG(moreProps) {
		var { xAccessor } = moreProps;
		var { xScale, chartConfig: { yScale }, plotData } = moreProps;

		var { className, usingProps, with: Annotation } = this.props;
		var data = helper(this.props, plotData);

		return (
			<g className={`react-stockcharts-enable-interaction ${className}`}>
				{data.map((d, idx) => <Annotation key={idx}
						{...usingProps}
						xScale={xScale}
						yScale={yScale}
						xAccessor={xAccessor}
						plotData={plotData}
						datum={d} />)}
			</g>
		);
	}
}

Annotate.propTypes = {
	className: PropTypes.string.isRequired,
	with: PropTypes.func,
	when: PropTypes.func,
	usingProps: PropTypes.object,
};

Annotate.defaultProps = {
	className: "react-stockcharts-annotate react-stockcharts-default-cursor",
};

function helper({ when }, plotData) {
	return plotData.filter(when);
}

export default Annotate;
