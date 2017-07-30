"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, yes, noop, findItem } from "../utils";

import { getValueFromOverride } from "./utils";

import EachText from "./hoc/EachText";
import HoverTextNearMouse from "./components/HoverTextNearMouse";
import GenericChartComponent from "../GenericChartComponent";
import { getMouseCanvas } from "../GenericComponent";

class InteractiveText extends Component {
	constructor(props) {
		super(props);

		this.handleDraw = this.handleDraw.bind(this);
		/*
		this.handleDrawLine = this.handleDrawLine.bind(this);
		this.handleDragLine = this.handleDragLine.bind(this);
		this.handleDragLineComplete = this.handleDragLineComplete.bind(this);
		*/
		this.terminate = this.terminate.bind(this);
		this.listener = this.listener.bind(this);

		this.state = {};
	}
	componentWillMount() {
		const { subscribe, generateSubscriptionId } = this.context;
		this.id = generateSubscriptionId();

		subscribe(this.id,
			{
				listener: this.listener,
			}
		);
	}
	componentWillUnmount() {
		const { unsubscribe } = this.context;
		unsubscribe(this.id);
	}
	listener(type, moreProps, state) {
		if (type === "click") {
			const { chartId } = this.context;
			const { enabled } = this.props;
			const { currentCharts } = moreProps;
			if (enabled && currentCharts.indexOf(chartId) > -1) {
				const {
					chartConfig: chartConfigArray,
					xAccessor
				} = state;
				const chartConfig = findItem(chartConfigArray, item => item.id === chartId);

				this.handleDraw({
					...moreProps,
					xAccessor,
					chartConfig,
				});
			}
		}
	}
	terminate() {
		this.setState({
			override: null,
		});
	}
	handleDragLine(index, newXYValue) {
		this.setState({
			override: {
				index,
				...newXYValue
			}
		});
	}
	handleDragLineComplete() {
		const { override } = this.state;
		if (isDefined(override)) {
			const { channels } = this.props;
			const newTrends = channels
				.map((each, idx) => idx === override.index
					? {
						start: [override.x1Value, override.y1Value],
						end: [override.x2Value, override.y2Value],
					}
					: each);
			this.setState({
				override: null
			}, () => {
				this.props.onComplete(newTrends);
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
	handleDraw(moreProps) {
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
	}
	render() {
		const { enabled, textList, defaultText } = this.props;
		const { override } = this.state;
		return <g>
			{textList.map((each, idx) => {
				const props = {
					...defaultText,
					...each,
				};

				return <EachText
					key={idx}
					index={idx}
					position={getValueFromOverride(override, idx, "position", each.position)}
					{...props}

					onDrag={this.handleDragLine}
					onDragComplete={this.handleDragTextComplete}
					edgeInteractiveCursor="react-stockcharts-move-cursor"
				/>;
			})}
		</g>;
	}
}
/* 			<MouseLocationIndicator
				enabled={enabled}
				snap={false}
				r={0}
				opacity={0}
				onMouseDown={this.handleDraw} /> */

InteractiveText.propTypes = {
	enabled: PropTypes.bool.isRequired,

	onChoosePosition: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,

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
};

InteractiveText.defaultProps = {
	onChoosePosition: noop,
	onDragComplete: noop,

	defaultText: {
		bgFill: "#9E7523",
		bgOpacity: 0.2,
		textFill: "#9E7523",
		fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
		fontSize: 12,
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
