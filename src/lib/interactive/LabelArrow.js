import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, noop } from "../utils";

import {
	getValueFromOverride,
	terminate,
	saveNodeType,
	isHoverForInteractiveType,
} from "./utils";
import EachLabelArrow from "./wrapper/EachLabelArrow";
import HoverTextNearMouse from "./components/HoverTextNearMouse";
import GenericChartComponent from "../GenericChartComponent";
import { getMouseCanvas } from "../GenericComponent";

class LabelArrow extends Component {
	constructor(props) {
		super(props);

		this.handleDraw = this.handleDraw.bind(this);
		this.handleDrag = this.handleDrag.bind(this);
		this.handleDragComplete = this.handleDragComplete.bind(this);
		this.terminate = terminate.bind(this);

		this.saveNodeType = saveNodeType.bind(this);
		this.getSelectionState = isHoverForInteractiveType(
			"labelArrowList"
		).bind(this);

		this.nodes = [];
		this.state = {};
	}
	handleDrag(index, position) {
		this.setState({
			override: {
				index,
				position,
			},
		});
	}
	handleDragComplete(moreProps) {
		const { override } = this.state;
		if (isDefined(override)) {
			const { labelArrowList } = this.props;
			const newTextList = labelArrowList.map((each, idx) => {
				const selected = idx === override.index;
				return selected
					? {
						...each,
						position: override.position,
						selected: true,
					}
					: {
						...each,
						selected: false,
					};
			});
			this.setState(
				{
					override: null,
				},
				() => {
					this.props.onDragComplete(newTextList, moreProps);
				}
			);
		}
	}

	handleDraw(moreProps, e) {
		const { enabled, type, labelArrowList } = this.props;
		const {
			mouseXY: [, mouseY],
			chartConfig: { yScale },
			xAccessor,
			currentItem,
		} = moreProps;

		const xyValue = [xAccessor(currentItem), yScale.invert(mouseY)];
		if (enabled) {
			const { onChoosePosition } = this.props;

			const newText = {
				type,
				position: xyValue,
			};
			onChoosePosition(newText, moreProps, e);
		} else {
			const newLabels = [
				...labelArrowList.map((d) => ({ ...d, selected: false })),
			];
			this.props.onDragComplete(newLabels, moreProps);
		}
	}
	render() {
		const { labelArrowList, defaultText, hoverText } = this.props;
		const { override } = this.state;

		return (
			<g>
				{labelArrowList.map((each, idx) => {
					const defaultHoverText = LabelArrow.defaultProps.hoverText;
					const props = {
						...defaultText,
						...each,
						hoverText: {
							...defaultHoverText,
							...hoverText,
							...(each.hoverText || {}),
						},
					};
					return (
						<EachLabelArrow
							key={idx}
							ref={this.saveNodeType(idx)}
							index={idx}
							id={idx + each.position[0]}
							{...props}
							selected={each.selected}
							position={getValueFromOverride(
								override,
								idx,
								"position",
								each.position
							)}
							type={each.type}
							fill={each.appearance[each.type.toLowerCase()].fill}
							width={each.width}
							onDrag={this.handleDrag}
							onDragComplete={this.handleDragComplete}
							edgeInteractiveCursor="react-stockcharts-move-cursor"
						/>
					);
				})}
				<GenericChartComponent
					onClick={this.handleDraw}
					svgDraw={noop}
					canvasDraw={noop}
					canvasToDraw={getMouseCanvas}
					drawOn={["mousemove", "pan"]}
				/>
                ;
			</g>
		);
	}
}

LabelArrow.propTypes = {
	onChoosePosition: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,
	onSelect: PropTypes.func,
	type: PropTypes.oneOf(["OPEN", "CLOSE"]).isRequired,
	appearance: PropTypes.shape({
		width: PropTypes.number.isRequired,
		open: PropTypes.shape({
			fill: PropTypes.string.isRequired,
		}),
		close: PropTypes.shape({
			fill: PropTypes.string.isRequired,
		}),
	}),

	hoverText: PropTypes.object.isRequired,
	labelArrowList: PropTypes.array.isRequired,
	enabled: PropTypes.bool.isRequired,
};

LabelArrow.defaultProps = {
	onChoosePosition: noop,
	onDragComplete: noop,
	onSelect: noop,

	type: "OPEN",

	appearance: {
		width: 40,
		open: {
			fill: "green",
		},
		close: {
			fill: "red",
		},
	},
	hoverText: {
		...HoverTextNearMouse.defaultProps,
		enable: true,
		bgHeight: "auto",
		bgWidth: "auto",
		text: "Click to select object",
		selectedText: "",
	},
	labelArrowList: [],
};

LabelArrow.contextTypes = {
	subscribe: PropTypes.func.isRequired,
	unsubscribe: PropTypes.func.isRequired,
	generateSubscriptionId: PropTypes.func.isRequired,
	chartId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
		.isRequired,
};

export default LabelArrow;
