

import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, noop, mapObject, head } from "../utils";
import { getMorePropsForChart, getSelected } from "./utils";

import GenericComponent, { getMouseCanvas } from "../GenericComponent";

class DrawingObjectSelector extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.handleDoubleClick = this.handleDoubleClick.bind(this);
		this.getInteraction = this.getInteraction.bind(this);
	}
	handleDoubleClick(moreProps, e) {
		e.preventDefault();
		const { onDoubleClick } = this.props;
		const { enabled } = this.props;
		if (!enabled) return;

		const interactives = this.getInteraction(moreProps);
		const allSelected = getSelected(interactives);

		// console.log(selected, interactives)
		if (allSelected.length > 0) {
			const selected = head(allSelected);
			const item = {
				type: selected.type,
				chartId: selected.chartId,
				object: head(selected.objects)
			};
			const morePropsForChart = getMorePropsForChart(
				moreProps, selected.chartId
			);
			onDoubleClick(item, morePropsForChart);
		}
	}
	handleClick(moreProps, e) {
		e.preventDefault();
		const { onSelect } = this.props;
		const { enabled } = this.props;
		if (!enabled) return;

		const interactives = this.getInteraction(moreProps);

		onSelect(interactives, moreProps);
	}
	getInteraction(moreProps) {
		const { getInteractiveNodes, drawingObjectMap } = this.props;
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

		return interactives;
	}

	render() {
		return (
			<GenericComponent
				svgDraw={noop}
				canvasToDraw={getMouseCanvas}
				canvasDraw={noop}

				onMouseDown={this.handleClick}
				onDoubleClick={this.handleDoubleClick}

				drawOn={["mousemove", "pan", "drag"]}
			/>
		);
	}
}


DrawingObjectSelector.propTypes = {
	getInteractiveNodes: PropTypes.func.isRequired,
	onSelect: PropTypes.func.isRequired,
	onDoubleClick: PropTypes.func.isRequired,
	drawingObjectMap: PropTypes.object.isRequired,
	enabled: PropTypes.bool.isRequired,
};

DrawingObjectSelector.defaultProps = {
	enabled: true,
	onDoubleClick: noop,
};

export default DrawingObjectSelector;
