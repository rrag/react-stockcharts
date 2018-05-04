import React, { Component } from "react";
import PropTypes from "prop-types";

import { noop } from "../../utils";
import { saveNodeType, isHover } from "../utils";

import ClickableShape from "../components/ClickableShape";
import InteractiveYCoordinate from "../components/InteractiveYCoordinate";

class EachInteractiveYCoordinate extends Component {
	constructor(props) {
		super(props);

		this.handleHover = this.handleHover.bind(this);
		this.handleCloseIconHover = this.handleCloseIconHover.bind(this);

		this.handleDragStart = this.handleDragStart.bind(this);
		this.handleDrag = this.handleDrag.bind(this);

		this.handleDelete = this.handleDelete.bind(this);

		this.isHover = isHover.bind(this);
		this.saveNodeType = saveNodeType.bind(this);
		this.nodes = {};

		this.state = {
			hover: false,
			closeIconHover: false,
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
	handleDelete(moreProps) {
		const { index, onDelete } = this.props;
		onDelete(index, moreProps);
	}
	handleHover(moreProps) {
		if (this.state.hover !== moreProps.hovering) {
			this.setState({
				hover: moreProps.hovering,
				closeIconHover: moreProps.hovering ? this.state.closeIconHover : false
			});
		}
	}
	handleCloseIconHover(moreProps) {
		if (this.state.closeIconHover !== moreProps.hovering) {
			this.setState({
				closeIconHover: moreProps.hovering
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
			stroke,
			strokeOpacity,
			strokeDasharray,
			strokeWidth,
			edge,
			textBox,
			draggable,
		} = this.props;
		const { hover, closeIconHover } = this.state;

		const hoverHandler = {
			onHover: this.handleHover,
			onUnHover: this.handleHover
		};

		const dragProps = draggable
			? {
				onDragStart: this.handleDragStart,
				onDrag: this.handleDrag,
				onDragComplete: onDragComplete,
			}
			: {};
		return (
			<g>
				<InteractiveYCoordinate
					ref={this.saveNodeType("priceCoordinate")}
					selected={selected && !closeIconHover}
					hovering={hover || closeIconHover}
					interactiveCursorClass="react-stockcharts-move-cursor"
					{...hoverHandler}

					{...dragProps}

					yValue={yValue}
					bgFill={bgFill}
					bgOpacity={bgOpacity}
					textFill={textFill}
					fontFamily={fontFamily}
					fontStyle={fontStyle}
					fontWeight={fontWeight}
					fontSize={fontSize}
					stroke={stroke}
					strokeOpacity={strokeOpacity}
					strokeDasharray={strokeDasharray}
					strokeWidth={strokeWidth}
					text={text}
					textBox={textBox}
					edge={edge}
				/>
				<ClickableShape
					show
					hovering={closeIconHover}
					text={text}
					yValue={yValue}
					fontFamily={fontFamily}
					fontStyle={fontStyle}
					fontWeight={fontWeight}
					fontSize={fontSize}
					textBox={textBox}

					stroke={stroke}
					strokeOpacity={strokeOpacity}

					onHover={this.handleCloseIconHover}
					onUnHover={this.handleCloseIconHover}
					onClick={this.handleDelete}
				/>
				{/* <HoverTextNearMouse
					show={hoverTextEnabled && hover && !selected}
					{...restHoverTextProps}
				/> */}
			</g>
		);
	}
}

EachInteractiveYCoordinate.propTypes = {
	index: PropTypes.number,

	draggable: PropTypes.bool.isRequired,
	yValue: PropTypes.number.isRequired,

	bgFill: PropTypes.string.isRequired,
	bgOpacity: PropTypes.number.isRequired,
	stroke: PropTypes.string.isRequired,
	strokeWidth: PropTypes.number.isRequired,
	strokeOpacity: PropTypes.number.isRequired,
	strokeDasharray: PropTypes.string.isRequired,
	textFill: PropTypes.string.isRequired,

	fontWeight: PropTypes.string.isRequired,
	fontFamily: PropTypes.string.isRequired,
	fontStyle: PropTypes.string.isRequired,
	fontSize: PropTypes.number.isRequired,

	text: PropTypes.string.isRequired,
	selected: PropTypes.bool.isRequired,

	edge: PropTypes.object.isRequired,
	textBox: PropTypes.object.isRequired,

	onDrag: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
};

EachInteractiveYCoordinate.defaultProps = {
	onDrag: noop,
	onDragComplete: noop,

	strokeWidth: 1,
	opacity: 1,
	selected: false,
	fill: "#FFFFFF",
	draggable: false,
};

export default EachInteractiveYCoordinate;