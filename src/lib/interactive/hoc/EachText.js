import React, { Component } from "react";
import PropTypes from "prop-types";

import { noop } from "../../utils";
import { getCurrentItem } from "../../utils/ChartDataUtil";

import HoverTextNearMouse from "../components/HoverTextNearMouse";
import InteractiveText from "../components/InteractiveText";

class EachText extends Component {
	constructor(props) {
		super(props);

		this.handleHover = this.handleHover.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.handleUnSelect = this.handleUnSelect.bind(this);

		this.handleDrag = this.handleDrag.bind(this);
		this.handleDragComplete = this.handleDragComplete.bind(this);

		this.state = {
			selected: false,
			hover: false,
		};
	}
	handleSelect() {
		this.setState({
			selected: !this.state.selected
		});
	}
	handleUnSelect() {
		if (this.state.selected) {
			this.setState({
				selected: false
			});
		}
	}
	handleDrag(moreProps) {
		const { index, onDrag, snapTo } = this.props;
		const {
			x2Value,
		} = this.props;

		const [x1Value] = getNewXY(moreProps, snapTo);

		onDrag(index, {
			x1Value,
			x2Value,
		});
	}
	handleDragComplete() {
		const { onDragComplete } = this.props;

		if (!this.state.selected) {
			this.setState({
				selected: true,
			});
		}
		onDragComplete();
	}
	handleHover(moreProps) {
		if (this.state.hover !== moreProps.hovering) {
			this.setState({
				hover: moreProps.hovering
			});
		}
	}
	render() {
		const {
			position,
			bgFill,
			bgOpacity,
			textFill,
			fontFamily,
			fontSize,
			text,
			hoverText,
		} = this.props;
		const { selected, hover } = this.state;

		const hoverHandler = {
			onHover: this.handleHover,
			onUnHover: this.handleHover
		};

		const { enable: hoverTextEnabled, ...restHoverTextProps } = hoverText;

		// console.log("SELECTED ->", selected);
		return <g>
			<InteractiveText
				selected={selected || hover}
				interactiveCursorClass="react-stockcharts-move-cursor"
				{...hoverHandler}
				onClickWhenHovering={this.handleSelect}
				onClickOutside={this.handleUnSelect}
				position={position}
				bgFill={bgFill}
				bgOpacity={(hover || selected) ? bgOpacity : 0.8}
				textFill={textFill}
				fontFamily={fontFamily}
				fontSize={fontSize}
				text={text}
			/>
			<HoverTextNearMouse
				show={hoverTextEnabled && hover && !selected}
				{...restHoverTextProps} />
		</g>;
	}
}

export function getNewXY(moreProps, snapTo) {
	const { xScale, xAccessor, plotData, mouseXY } = moreProps;

	const currentItem = getCurrentItem(xScale, xAccessor, mouseXY, plotData);
	const x = xAccessor(currentItem);
	const y = snapTo(currentItem);

	return [x, y];
}

EachText.propTypes = {
	index: PropTypes.number,

	position: PropTypes.array.isRequired,
	bgFill: PropTypes.string.isRequired,
	bgOpacity: PropTypes.number.isRequired,
	textFill: PropTypes.string.isRequired,
	fontFamily: PropTypes.string.isRequired,
	fontSize: PropTypes.number.isRequired,
	text: PropTypes.string.isRequired,

	onDrag: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,

	hoverText: PropTypes.object.isRequired,
};

EachText.defaultProps = {
	onDrag: noop,
	onDragComplete: noop,
	edgeStroke: "#000000",
	edgeFill: "#FFFFFF",
	edgeStrokeWidth: 2,
	r: 5,
	strokeWidth: 1,
	opacity: 1,
	interactive: true,
	fill: "#8AAFE2",
	hoverText: {
		...HoverTextNearMouse.defaultProps,
		enable: true,
		bgHeight: 18,
		bgWidth: 120,
		text: "Click to select object",
	}
};

export default EachText;