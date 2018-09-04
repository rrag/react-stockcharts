import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../../GenericChartComponent";
import { isDefined } from "../../utils";

const PADDING = 10;
const MIN_WIDTH = PADDING;

class HoverTextNearMouse extends Component {
	constructor(props) {
		super(props);

		this.state = {
			textWidth: undefined,
			textHeight: undefined,
		};

		this.saveNode = this.saveNode.bind(this);
		this.updateTextSize = this.updateTextSize.bind(this);
		this.renderSVG = this.renderSVG.bind(this);
	}
	saveNode(node) {
		this.textNode = node;
	}

	updateTextSize() {
		const { bgWidth, bgHeight } = this.props;
		if (bgWidth === "auto" || bgHeight === "auto") {
			const textNode = this.textNode;
			if (textNode) {
				const { width, height } = textNode.getBBox();
				if (this.state.textWidth !== width || this.state.textHeight !== height) {
					this.setState({
						textWidth: width,
						textHeight: height
					});
				}
			}
		}
	}

	componentDidMount() {
		this.updateTextSize();
	}

	componentDidUpdate() {
		this.updateTextSize();
	}

	getBgWidth() {
		const { bgWidth } = this.props;
		const { textWidth } = this.state;

		if (bgWidth !== "auto") {
			return bgWidth;
		} else if (textWidth !== undefined) {
			return textWidth + PADDING;
		} else {
			return MIN_WIDTH;
		}
	}

	getBgHeight() {
		const { bgHeight } = this.props;
		const { textHeight } = this.state;

		if (bgHeight !== "auto") {
			return bgHeight;
		} else if (textHeight !== undefined) {
			return textHeight + PADDING;
		} else {
			return MIN_WIDTH;
		}
	}

	renderSVG(moreProps) {
		const {
			fontFamily,
			fontSize,
			fill,
			bgFill,
			bgOpacity,
		} = this.props;

		// console.log(moreProps)
		const textMetaData = helper({
			...this.props,
			bgWidth: this.getBgWidth(),
			bgHeight: this.getBgHeight()
		}, moreProps);

		if (isDefined(textMetaData)) {
			const { rect, text } = textMetaData;
			return (
				<g>
					<rect
						fill={bgFill}
						fillOpacity={bgOpacity}
						stroke={bgFill}
						{...rect}
					/>
					<text
						ref={this.saveNode}
						fontSize={fontSize}
						fontFamily={fontFamily}
						textAnchor="start"
						alignmentBaseline={"central"}
						fill={fill}
						x={text.x}
						y={text.y}>{text.text}</text>
				</g>
			);
		}
	}
	render() {
		const { text } = this.props;
		if (text) {
			return <GenericChartComponent
				svgDraw={this.renderSVG}
				drawOn={["mousemove"]}
			/>;
		} else {
			return null;
		}
	}
}

const numberOrString = PropTypes.oneOfType([
	PropTypes.number,
	PropTypes.oneOf(["auto"]),
]);

HoverTextNearMouse.propTypes = {
	fontFamily: PropTypes.string.isRequired,
	fontSize: PropTypes.number.isRequired,
	fill: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
	bgFill: PropTypes.string.isRequired,
	bgOpacity: PropTypes.number.isRequired,
	bgWidth: numberOrString.isRequired,
	bgHeight: numberOrString.isRequired,
	show: PropTypes.bool.isRequired,
};

HoverTextNearMouse.defaultProps = {
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12,
	fill: "#000000",
	bgFill: "#FA9325",
	bgOpacity: 0.5,
};

function helper(props, moreProps) {
	const {
		show,
		bgWidth,
		bgHeight,
	} = props;

	const {
		mouseXY,
		chartConfig: { height, width },
		show: mouseInsideCanvas
	} = moreProps;

	if (show && mouseInsideCanvas) {
		const [x, y] = mouseXY;

		const cx = x < width / 2
			? x + PADDING
			: x - bgWidth - PADDING;

		const cy = y < height / 2
			? y + PADDING
			: y - bgHeight - PADDING;

		const rect = {
			x: cx,
			y: cy,
			width: bgWidth,
			height: bgHeight,
		};

		const text = {
			text: props.text,
			x: cx + PADDING / 2,
			y: cy + bgHeight / 2,
		};

		return {
			rect,
			text
		};
	}
}

export default HoverTextNearMouse;
