"use strict";

import React, { PropTypes, Component } from "react";
import { isDefined } from "./utils";

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
		var { height, width, type, zIndex, ratio } = this.props;
		if (type === "svg") return null;
		// console.log("using ratio ", ratio);
		return (
			<div style={{ zIndex: zIndex }}>
				<canvas id="bg" ref={this.setDrawCanvas} width={width * ratio} height={height * ratio}
					style={{ position: "absolute", left: 0, top: 0, width: width, height: height }} />
				<canvas id="axes" ref={this.setDrawCanvas} width={width * ratio} height={height * ratio}
					style={{ position: "absolute", left: 0, top: 0, width: width, height: height }} />
				<canvas id="mouseCoord" ref={this.setDrawCanvas} width={width * ratio} height={height * ratio}
					style={{ position: "absolute", left: 0, top: 0, width: width, height: height }} />
			</div>
		);
	}
}

/*
				<canvas ref="canvas_interactive" width={width} height={height}
					style={{ position: "absolute", left: 0, top: 0 }} />
*/

CanvasContainer.propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	type: PropTypes.string.isRequired,
	zIndex: PropTypes.number,
	ratio: PropTypes.number.isRequired,
};

export default CanvasContainer;
