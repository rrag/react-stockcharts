"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, noop, mapObject } from "../utils";
import { getMorePropsForChart } from "./utils";

import GenericComponent, { getMouseCanvas } from "../GenericComponent";


class DrawingObjectSelector extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(moreProps, e) {
		e.preventDefault();
		const { enabled, getInteractiveNodes, drawingObjectMap } = this.props;
		const { onSelect } = this.props;
		if (!enabled) return;

		const interactiveNodes = getInteractiveNodes();
		const interactives = mapObject(interactiveNodes, each => {
			const key = drawingObjectMap[each.type];

			const valueArray = isDefined(key)
				? each.node.props[key]
				: undefined;

			const valuePresent = isDefined(valueArray)
				&& Array.isArray(valueArray)
				&& valueArray.length > 0;
			if (valuePresent) {
				// console.log("Value present for ", each.type, each.chartId);
				const morePropsForChart = getMorePropsForChart(
					moreProps, each.chartId
				);

				const objects = each.node.getSelectionState(morePropsForChart);

				return {
					type: each.type,
					chartId: each.chartId,
					objects,
				};
			}
			return {
				type: each.type,
				chartId: each.chartId,
				objects: [],
			};
		});
		onSelect(interactives, moreProps, e);
	}
	render() {
		return (
			<GenericComponent
				svgDraw={noop}
				canvasToDraw={getMouseCanvas}
				canvasDraw={noop}

				onClick={this.handleClick}

				drawOn={["mousemove", "pan", "drag"]}
			/>
		);
	}
}


DrawingObjectSelector.propTypes = {
	getInteractiveNodes: PropTypes.func.isRequired,
	onSelect: PropTypes.func.isRequired,
	drawingObjectMap: PropTypes.object.isRequired,
	enabled: PropTypes.bool.isRequired,
};

DrawingObjectSelector.defaultProps = {
	enabled: true
};

export default DrawingObjectSelector;
