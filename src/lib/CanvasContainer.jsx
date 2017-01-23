"use strict";

import React, { PropTypes, Component } from "react";
import { isDefined, getLogger } from "./utils";

const log = getLogger("CanvasContainer");

class CanvasContainer extends Component {
	constructor(props) {
		super(props);
		this.setDrawCanvas = this.setDrawCanvas.bind(this);
		this.drawCanvas = {};
	}
	setDrawCanvas(node) {
		if (isDefined(node))
			this.drawCanvas[node.id] = node.getContext("2d");
		else
			this.drawCanvas = {};
	}
	getCanvasContexts() {
		if (isDefined(this.drawCanvas.axes)) {
			return this.drawCanvas;
		}
	}
	render() {
		const { height, width, type, zIndex, ratio } = this.props;
		if (type === "svg") return null;

		log("using ratio ", ratio);

		return (
			<div style={{ position: "absolute", zIndex: zIndex }}>
				<canvas id="bg" ref={this.setDrawCanvas} width={width * ratio} height={height * ratio}
					style={{ position: "absolute", width: width, height: height }} />
				<canvas id="axes" ref={this.setDrawCanvas} width={width * ratio} height={height * ratio}
					style={{ position: "absolute", width: width, height: height }} />
				<canvas id="hover" ref={this.setDrawCanvas} width={width * ratio} height={height * ratio}
					style={{ position: "absolute", width: width, height: height }} />
				<canvas id="mouseCoord" ref={this.setDrawCanvas} width={width * ratio} height={height * ratio}
					style={{ position: "absolute", width: width, height: height }} />
			</div>
		);
	}
}

CanvasContainer.propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	type: PropTypes.string.isRequired,
	zIndex: PropTypes.number,
	ratio: PropTypes.number.isRequired,
};

export default CanvasContainer;
