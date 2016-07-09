"use strict";

import React, { PropTypes, Component } from "react";

import pure from "../pure";

class Annotate extends Component {
	constructor(props) {
		super(props);
		this.annotate = this.annotate.bind(this);
	}
	annotate({ xScale, chartConfig, plotData }) {
		var { chartId } = this.props;

		var { yScale } = chartConfig.filter(each => each.id === chartId)[0];
		this.setState({ plotData, xScale, yScale });
	}
	componentWillReceiveProps(nextProps) {
		var { plotData, xScale, chartConfig, chartId } = nextProps;
		var { yScale } = chartConfig.filter(each => each.id === chartId)[0];

		this.setState({ plotData, xScale, yScale });

		var { id, chartCanvasType, callbackForCanvasDraw, getAllCanvasDrawCallback } = nextProps;

		if (chartCanvasType !== "svg") {
			var temp = getAllCanvasDrawCallback().filter(each => each.type === "annotation").filter(each => each.id === id);
			if (temp.length === 0) {
				callbackForCanvasDraw({
					id,
					type: "annotation",
					draw: this.annotate,
				});
			} else {
				callbackForCanvasDraw(temp[0], {
					id,
					type: "annotation",
					draw: this.annotate,
				});
			}
		}
	}
	componentWillMount() {
		this.componentWillReceiveProps(this.props);
	}
	render() {
		var { yScale, xScale, plotData } = this.state;
		var { className, xAccessor, usingProps, with: Annotation } = this.props;
		var data = helper(this.props, plotData);

		return (
			<g className={className}>
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
	id: PropTypes.number.isRequired,
	chartId: PropTypes.number.isRequired,
	xAccessor: PropTypes.func.isRequired,
	xScale: PropTypes.func.isRequired,
	plotData: PropTypes.array.isRequired,
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

export default pure(Annotate, {
	callbackForCanvasDraw: PropTypes.func.isRequired,
	getAllCanvasDrawCallback: PropTypes.func,
	chartConfig: PropTypes.array.isRequired,
	chartCanvasType: PropTypes.string,
	xScale: PropTypes.func.isRequired,
	xAccessor: PropTypes.func.isRequired,
	plotData: PropTypes.array.isRequired,
});
