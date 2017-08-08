"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, noop } from "../utils";

import {
	getValueFromOverride,
	terminate,
	saveNodeList,
	handleClickInteractiveType,
} from "./utils";
import EachText from "./hoc/EachText";
import HoverTextNearMouse from "./components/HoverTextNearMouse";
import GenericChartComponent from "../GenericChartComponent";
import { getMouseCanvas } from "../GenericComponent";

class InteractiveText extends Component {
	constructor(props) {
		super(props);

		this.handleDraw = this.handleDraw.bind(this);
		this.handleDrag = this.handleDrag.bind(this);
		this.handleDragComplete = this.handleDragComplete.bind(this);
		this.terminate = terminate.bind(this);
		this.handleClick = handleClickInteractiveType("textList").bind(this);
		this.saveNodeList = saveNodeList.bind(this);

		this.nodes = [];
		this.state = {};
	}
	componentWillMount() {
		this.updateInteractiveToState(this.props.textList);
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.textList !== nextProps.textList) {
			this.updateInteractiveToState(nextProps.textList);
		}
	}
	updateInteractiveToState(textList) {
		this.setState({
			textList: textList.map(t => {
				return {
					...t,
					selected: !!t.selected
				};
			}),
		});
	}
	handleDrag(index, position) {
		this.setState({
			override: {
				index,
				position,
			}
		});
	}
	handleDragComplete() {
		const { override } = this.state;
		if (isDefined(override)) {
			const { textList } = this.state;
			const newTextList = textList
				.map((each, idx) => idx === override.index
					? {
						...each,
						position: override.position,
						selected: true,
					}
					: each);
			this.setState({
				override: null,
				textList: newTextList,
			}, () => {
				this.props.onDragComplete(newTextList);
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
	handleDraw(moreProps, e) {
		const { enabled } = this.props;
		if (enabled) {
			const {
				mouseXY: [, mouseY],
				chartConfig: { yScale },
				xAccessor,
				currentItem,
			} = moreProps;

			const xyValue = [xAccessor(currentItem), yScale.invert(mouseY)];

			const { defaultText, onChoosePosition } = this.props;

			const newText = {
				...defaultText,
				position: xyValue,
			};
			onChoosePosition(newText);
		} else {
			this.handleClick(moreProps, e);
		}
	}
	render() {
		const { defaultText } = this.props;
		const { textList, override } = this.state;
		return <g>
			{textList.map((each, idx) => {
				const props = {
					...defaultText,
					...each,
				};
				return <EachText key={idx}
					ref={this.saveNodeList}
					index={idx}
					{...props}
					selected={each.selected}
					position={getValueFromOverride(override, idx, "position", each.position)}

					onDrag={this.handleDrag}
					onDragComplete={this.handleDragComplete}
					edgeInteractiveCursor="react-stockcharts-move-cursor"
				/>;
			})}
			<GenericChartComponent

				onClick={this.handleDraw}

				svgDraw={noop}
				canvasDraw={noop}
				canvasToDraw={getMouseCanvas}

				drawOn={["mousemove", "pan"]}
			/>;
		</g>;
	}
}

InteractiveText.propTypes = {
	onChoosePosition: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,
	onSelect: PropTypes.func,

	defaultText: PropTypes.shape({
		bgFill: PropTypes.string.isRequired,
		bgOpacity: PropTypes.number.isRequired,
		textFill: PropTypes.string.isRequired,
		fontFamily: PropTypes.string.isRequired,
		fontSize: PropTypes.number.isRequired,
		text: PropTypes.string.isRequired,
	}).isRequired,

	hoverText: PropTypes.object.isRequired,
	textList: PropTypes.array.isRequired,
	enabled: PropTypes.bool.isRequired,
};

InteractiveText.defaultProps = {
	onChoosePosition: noop,
	onDragComplete: noop,
	onSelect: noop,

	defaultText: {
		bgFill: "#9E7523",
		bgOpacity: 0.01,
		textFill: "#9E7523",
		fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
		fontSize: 12,
		fontWeight: "500",
		text: "Lorem ipsum..."
	},
	hoverText: {
		...HoverTextNearMouse.defaultProps,
		enable: true,
		bgHeight: 18,
		bgWidth: 175,
		text: "Click and drag the edge circles",
	},
	textList: [],
};

InteractiveText.contextTypes = {
	subscribe: PropTypes.func.isRequired,
	unsubscribe: PropTypes.func.isRequired,
	generateSubscriptionId: PropTypes.func.isRequired,
	chartId: PropTypes.number,
};

export default InteractiveText;
