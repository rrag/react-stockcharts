import React, { Component } from "react";
import PropTypes from "prop-types";

import { noop } from "../../utils";
import { saveNodeType, isHover } from "../utils";

// import HoverTextNearMouse from "../components/HoverTextNearMouse";
import InteractivePriceCoordinate from "../components/InteractivePriceCoordinate";

class EachPriceCoordinate extends Component {
	constructor(props) {
		super(props);

		this.handleHover = this.handleHover.bind(this);

		this.handleDragStart = this.handleDragStart.bind(this);
		this.handleDrag = this.handleDrag.bind(this);

		this.isHover = isHover.bind(this);
		this.saveNodeType = saveNodeType.bind(this);
		this.nodes = {};

		this.state = {
			hover: false,
		};
	}
	handleDragStart(moreProps) {
		const {
			yValue,
		} = this.props;
		const { mouseXY } = moreProps;
		const { chartConfig: { yScale } } = moreProps;
		const [, mouseY] = mouseXY;

		const dy = mouseY - yScale(yValue);

		this.dragStartPosition = {
			yValue, dy
		};
	}
	handleDrag(moreProps) {
		const { index, onDrag } = this.props;
		const {
			mouseXY: [, mouseY],
			chartConfig: { yScale },
		} = moreProps;

		const { dy } = this.dragStartPosition;

		const newYValue = yScale.invert(mouseY - dy);

		onDrag(index, newYValue);
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
			yValue,
			bgFill,
			bgOpacity,
			textFill,
			fontFamily,
			fontSize,
			fontWeight,
			fontStyle,
			text,
			// hoverText,
			selected,
			onDragComplete,
		} = this.props;
		const { hover } = this.state;

		const hoverHandler = {
			onHover: this.handleHover,
			onUnHover: this.handleHover
		};

		// const { enable: hoverTextEnabled, ...restHoverTextProps } = hoverText;

		return (
			<g>
				<InteractivePriceCoordinate
					ref={this.saveNodeType("priceCoordinate")}
					selected={selected}
					hovering={hover}
					interactiveCursorClass="react-stockcharts-move-cursor"
					{...hoverHandler}

					onDragStart={this.handleDragStart}
					onDrag={this.handleDrag}
					onDragComplete={onDragComplete}

					yValue={yValue}
					bgFill={bgFill}
					bgOpacity={bgOpacity}
					textFill={textFill}
					fontFamily={fontFamily}
					fontStyle={fontStyle}
					fontWeight={fontWeight}
					fontSize={fontSize}
					text={text}
				/>
				{/* <HoverTextNearMouse
					show={hoverTextEnabled && hover && !selected}
					{...restHoverTextProps}
				/> */}
			</g>
		);
	}
}

EachPriceCoordinate.propTypes = {
	index: PropTypes.number,

	yValue: PropTypes.number.isRequired,
	bgFill: PropTypes.string.isRequired,
	bgOpacity: PropTypes.number.isRequired,
	textFill: PropTypes.string.isRequired,

	fontWeight: PropTypes.string.isRequired,
	fontFamily: PropTypes.string.isRequired,
	fontStyle: PropTypes.string.isRequired,
	fontSize: PropTypes.number.isRequired,

	text: PropTypes.string.isRequired,
	selected: PropTypes.bool.isRequired,

	onDrag: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,
};

EachPriceCoordinate.defaultProps = {
	onDrag: noop,
	onDragComplete: noop,
	edgeStroke: "#000000",
	edgeFill: "#FFFFFF",
	edgeStrokeWidth: 2,
	r: 5,
	strokeWidth: 1,
	opacity: 1,
	selected: false,
	fill: "#FFFFFF",
};

export default EachPriceCoordinate;