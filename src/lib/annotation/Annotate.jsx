"use strict";

import React, { PropTypes, Component } from "react";
import ReactDOM from "react-dom";
import d3 from "d3";


import pure from "../pure";
import wrap from "../series/wrap";
import { isDefined } from "../utils";

class Annotate extends Component {
	constructor(props) {
		super(props);
		this.annotate = this.annotate.bind(this);
	}
	annotate({ xScale, chartConfig, plotData}) {
		var { chartId } = this.props;

		var { yScale } = chartConfig.filter(each => each.id === chartId)[0];
		this.setState({ plotData, xScale, yScale });
	}
	componentWillReceiveProps(nextProps) {
		var { plotData, xScale, chartConfig, chartId } = nextProps;
		var { yScale } = chartConfig.filter(each => each.id === chartId)[0];

		this.setState({ plotData, xScale, yScale });

		var { id, chartId, chartCanvasType, callbackForCanvasDraw, getAllCanvasDrawCallback } = nextProps;

		if (chartCanvasType !== "svg") {
			var temp = getAllCanvasDrawCallback().filter(each => each.type === "annotation").filter(each => each.id === id);
			if (temp.length === 0) {
				nextProps.callbackForCanvasDraw({
					id,
					type: "annotation",
					draw: this.annotate,
				});
			} else {
				nextProps.callbackForCanvasDraw(temp[0], {
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
	id: PropTypes.number.isRequired,
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

export default pure(Annotate, {
	callbackForCanvasDraw: PropTypes.func.isRequired,
	getAllCanvasDrawCallback: PropTypes.func,
	// seriesId: PropTypes.number.isRequired,
	// stroke: PropTypes.string,
	// fill: PropTypes.string,
	chartConfig: PropTypes.array.isRequired,
	chartCanvasType: PropTypes.string,
	xScale: PropTypes.func.isRequired,
	// yScale: PropTypes.func.isRequired,
	xAccessor: PropTypes.func.isRequired,
	plotData: PropTypes.array.isRequired,
});
