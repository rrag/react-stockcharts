"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, noop, functor } from "../utils";
import GenericChartComponent from "../GenericChartComponent";

class Brush extends Component {
	constructor(props) {
		super(props);
		this.handleStartAndEnd = this.handleStartAndEnd.bind(this);
		this.handleDrawBrush = this.handleDrawBrush.bind(this);
		this.state = {};
	}
	terminate() {
		this.setState({
			x1: null, y1: null,
			x2: null, y2: null,
			startItem: null,
			startClick: null,
			rect: null,
		});
	}
	handleDrawBrush() {
		var moreProps = this.refs.component.getMoreProps();

		var {
			xScale,
			mouseXY,
			currentItem,
			chartConfig,
			xAccessor,
		} = moreProps;

		var { enabled } = this.props;

		var { startClick, startItem } = this.state;

		if (enabled && isDefined(startItem)) {
			var { yScale } = chartConfig;

			var y1Value = yScale.invert(startClick[1]);
			var y2Value = yScale.invert(mouseXY[1]);

			var x1 = xScale(xAccessor(startItem));
			var y1 = yScale(y1Value);
			var x2 = xScale(xAccessor(currentItem));
			var y2 = yScale(y2Value);

			var height = Math.abs(y2 - y1);
			var width = Math.abs(x2 - x1);

			this.setState({
				rect: {
					x: Math.min(x1, x2),
					y: Math.min(y1, y2),
					height,
					width,
				}
			});
		}
	}
	handleStartAndEnd(e) {
		var moreProps = this.refs.component.getMoreProps();

		var {
			mouseXY,
			currentItem,
			chartConfig,
			displayXAccessor,
		} = moreProps;

		var { enabled, onBrush } = this.props;

		if (enabled) {
			var { x1, y1, startItem, startClick } = this.state;
			var { yScale } = chartConfig;
			var xValue = displayXAccessor(currentItem);
			var yValue = yScale.invert(mouseXY[1]);

			if (isDefined(startItem)) {
				// brush complete
				onBrush({
					x1,
					y1,
					x2: displayXAccessor(currentItem),
					y2: yValue,
					startItem,
					currentItem,
					startClick,
					mouseXY,
				}, e);
				this.terminate();
			} else {
				// brush start
				this.setState({
					x1: xValue,
					y1: yValue,
					x2: null,
					y2: null,
					startItem: currentItem,
					startClick: mouseXY,
				});
			}
		}
	}
	render() {
		var { rect } = this.state;
		var { fill, stroke, opacity } = this.props;
		var rectProps = { fill, stroke, opacity };

		return <g>
			{ isDefined(rect) ? <rect {...rect} {...rectProps} /> : null }
			<GenericChartComponent ref="component"
				svgDraw={this.renderSVG}
				isHover={functor(true)}
				onMouseDown={this.handleStartAndEnd}
				onMouseMove={this.handleDrawBrush}
				drawOnMouseExitOfCanvas
				/>
		</g>;
	}
}

Brush.propTypes = {
	enabled: PropTypes.bool.isRequired,
	onStart: PropTypes.func.isRequired,
	onBrush: PropTypes.func.isRequired,

	type: PropTypes.oneOf(["1D", "2D"]),
	stroke: PropTypes.string,
	fill: PropTypes.string,
	opacity: PropTypes.number,
	interactiveState: PropTypes.object,
};

Brush.defaultProps = {
	type: "2D",
	stroke: "#000000",
	opacity: 0.3,
	fill: "#3h3h3h",
	onBrush: noop,
	onStart: noop,
};

export default Brush;
