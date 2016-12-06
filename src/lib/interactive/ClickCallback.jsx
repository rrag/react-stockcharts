"use strict";

import React, { PropTypes, Component } from "react";

import { noop, functor } from "../utils";
import GenericChartComponent from "../GenericChartComponent";

class ClickCallback extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.handleContextMenu = this.handleContextMenu.bind(this);
		this.saveNode = this.saveNode.bind(this);
		this.getClickProps = this.getClickProps.bind(this);
	}
	saveNode(node) {
		this.node = node;
	}
	getClickProps() {
		var moreProps = this.node.getMoreProps();

		var {
			// xScale,
			// plotData,
			mouseXY,
			// currentCharts,
			currentItem,
			chartConfig,
			displayXAccessor,
		} = moreProps;

		var { yScale } = chartConfig;

		var yValue = yScale.invert(mouseXY[1]);
		var xValue = displayXAccessor(currentItem);

		return {
			xy: [xValue, yValue],
			mouseXY,
			currentItem
		};
	}
	handleContextMenu(e) {
		this.props.onContextMenu(this.getClickProps(), e);
	}
	handleClick(e) {
		this.props.onClick(this.getClickProps(), e);
	}
	render() {
		return <GenericChartComponent ref={this.saveNode}
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
	onContextMenu: PropTypes.func.isRequired,
};

ClickCallback.defaultProps = {
	onClick: (...rest) => { console.log(rest); },
	onContextMenu: (...rest) => { console.log(rest); },
};

export default ClickCallback;
