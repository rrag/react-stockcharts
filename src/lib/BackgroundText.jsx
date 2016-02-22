import React, { PropTypes } from "react";
import PureComponent from "./utils/PureComponent";

import { hexToRGBA, isDefined } from "./utils";

class BackgroundText extends PureComponent {
	componentDidMount() {
		if (this.context.chartCanvasType !== "svg" && isDefined(this.context.getCanvasContexts)) {
			var contexts = this.context.getCanvasContexts();
			if (contexts) BackgroundText.drawOnCanvas(contexts.bg, this.props, this.context, this.props.children);
		}
	}
	componentDidUpdate() {
		this.componentDidMount();
	}
	render() {
		var { chartCanvasType } = this.context;

		if (chartCanvasType !== "svg") return null;

		var { x, y, fill, opacity, stroke, strokeOpacity, fontFamily, fontSize, textAnchor } = this.props;
		var props = { x, y, fill, opacity, stroke, strokeOpacity, fontFamily, fontSize, textAnchor };
		return (
			<text {...props}>this.props.children(interval)</text>
		);
	}
}

BackgroundText.drawOnCanvas = (ctx, props, { interval }, getText) => {
	ctx.clearRect(-1, -1, ctx.canvas.width + 2, ctx.canvas.height + 2);
	ctx.save();

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(0.5, 0.5);

	var { x, y, fill, opacity, stroke, strokeOpacity, fontFamily, fontSize, textAnchor } = props;

	var text = getText(interval);

	ctx.strokeStyle = hexToRGBA(stroke, strokeOpacity);

	ctx.font = `${ fontSize }px ${ fontFamily }`;
	ctx.fillStyle = hexToRGBA(fill, opacity);
	ctx.textAlign = textAnchor === "middle" ? "center" : textAnchor;

	if (stroke !== "none") ctx.strokeText(text, x, y);
	ctx.fillText(text, x, y);

	ctx.restore();
};

BackgroundText.propTypes = {
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number.isRequired,
};

BackgroundText.defaultProps = {
	opacity: 0.3,
	fill: "#9E7523",
	stroke: "#9E7523",
	strokeOpacity: 1,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12,
	textAnchor: "middle",
};

BackgroundText.contextTypes = {
	interval: PropTypes.string.isRequired,
	getCanvasContexts: PropTypes.func,
	chartCanvasType: PropTypes.string,
};

export default BackgroundText;