

import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, noop } from "../utils";

import {
	getValueFromOverride,
	terminate,
	saveNodeType,
	isHoverForInteractiveType,
} from "./utils";
import EachPriceCoordinate from "./wrapper/EachPriceCoordinate";
import HoverTextNearMouse from "./components/HoverTextNearMouse";

class InteractivePriceCoordinate extends Component {
	constructor(props) {
		super(props);

		this.handleDrag = this.handleDrag.bind(this);
		this.handleDragComplete = this.handleDragComplete.bind(this);
		this.terminate = terminate.bind(this);

		this.saveNodeType = saveNodeType.bind(this);
		this.getSelectionState = isHoverForInteractiveType("alertList")
			.bind(this);

		this.nodes = [];
		this.state = {};
	}
	handleDrag(index, yValue) {
		this.setState({
			override: {
				index,
				yValue,
			}
		});
	}
	handleDragComplete(moreProps) {
		const { override } = this.state;
		if (isDefined(override)) {
			const { alertList } = this.props;
			const newAlertList = alertList
				.map((each, idx) => {
					const selected = (idx === override.index);
					return selected
						? {
							...each,
							yValue: override.yValue,
							selected,
						}
						: {
							...each,
							selected
						};
				});
			const draggedAlert = newAlertList[override.index];
			this.setState({
				override: null,
			}, () => {
				this.props.onDragComplete(newAlertList, moreProps, draggedAlert);
			});
		}
	}
	handleDrawLine(xyValue) {
		const { current } = this.state;

		if (isDefined(current) && isDefined(current.start)) {
			this.setState({
				current: {
					start: current.start,
					end: xyValue,
				}
			});
		}
	}
	render() {
		const { alertList } = this.props;
		const { override } = this.state;
		return (
			<g>
				{alertList.map((each, idx) => {
					const props = each;
					return (
						<EachPriceCoordinate key={idx}
							ref={this.saveNodeType(idx)}
							index={idx}
							{...props}
							selected={each.selected}
							yValue={getValueFromOverride(override, idx, "yValue", each.yValue)}

							onDrag={this.handleDrag}
							onDragComplete={this.handleDragComplete}
							edgeInteractiveCursor="react-stockcharts-move-cursor"
						/>
					);
				})}
			</g>
		);
	}
}

InteractivePriceCoordinate.propTypes = {
	onChoosePosition: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,
	onSelect: PropTypes.func,

	defaultPriceCoordinate: PropTypes.shape({
		bgFill: PropTypes.string.isRequired,
		bgOpacity: PropTypes.number.isRequired,
		textFill: PropTypes.string.isRequired,
		fontFamily: PropTypes.string.isRequired,
		fontWeight: PropTypes.string.isRequired,
		fontStyle: PropTypes.string.isRequired,
		fontSize: PropTypes.number.isRequired,
		text: PropTypes.string.isRequired,
	}).isRequired,

	hoverText: PropTypes.object.isRequired,
	alertList: PropTypes.array.isRequired,
	enabled: PropTypes.bool.isRequired,
};

InteractivePriceCoordinate.defaultProps = {
	onChoosePosition: noop,
	onDragComplete: noop,
	onSelect: noop,

	defaultPriceCoordinate: {
		bgFill: "#FFFFFF",
		bgOpacity: 1,
		textFill: "#F10040",
		fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		text: "Lorem ipsum..."
	},
	hoverText: {
		...HoverTextNearMouse.defaultProps,
		enable: true,
		bgHeight: 18,
		bgWidth: 175,
		text: "Click and drag the edge circles",
	},
	alertList: [],
};

InteractivePriceCoordinate.contextTypes = {
	subscribe: PropTypes.func.isRequired,
	unsubscribe: PropTypes.func.isRequired,
	generateSubscriptionId: PropTypes.func.isRequired,
	chartId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default InteractivePriceCoordinate;
