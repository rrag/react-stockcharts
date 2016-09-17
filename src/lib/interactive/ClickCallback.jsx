"use strict";

import React, { PropTypes, Component } from "react";

import { noop, functor } from "../utils";
import GenericChartComponent from "../GenericChartComponent";

class ClickCallback extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(e) {
		var moreProps = this.refs.component.getMoreProps();

		var {
			// xScale,
			// plotData,
			mouseXY,
			// currentCharts,
			currentItem,
			chartConfig,
		} = moreProps;

		var { displayXAccessor } = this.context;

		var { yScale } = chartConfig;

		var yValue = yScale.invert(mouseXY[1]);
		var xValue = displayXAccessor(currentItem);
		this.props.onClick({
			xy: [xValue, yValue],
			mouseXY,
			currentItem
		}, e);
	}
	render() {
		return <GenericChartComponent ref="component"
			svgDraw={functor(null)}
			isHover={functor(true)}
			onClick={this.handleClick}
			onContextMenu={this.handleContextMenu}
			/>;
	}
}

ClickCallback.drawOnCanvas = noop;

ClickCallback.propTypes = {
	onClick: PropTypes.func.isRequired,
};
ClickCallback.contextTypes = {
	xAccessor: PropTypes.func.isRequired,
	displayXAccessor: PropTypes.func.isRequired,
};

ClickCallback.defaultProps = {
	onClick: (e) => { console.log(e); },
};

export default ClickCallback;
