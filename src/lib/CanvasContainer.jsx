"use strict";

import React from "react";
import Utils from "./utils/utils";

class CanvasContainer extends React.Component {
	getCanvasContexts() {
		var axesCanvasDOM = Utils.isReactVersion14()
			? this.refs.canvas_axes
			: React.findDOMNode(this.refs.canvas_axes);

		var mouseCoordDOM = Utils.isReactVersion14()
			? this.refs.canvas_mouse_coordinates
			: React.findDOMNode(this.refs.canvas_mouse_coordinates);

		if (this.refs.canvas_axes) {
			return {
				axes: axesCanvasDOM.getContext('2d'),
				mouseCoord: mouseCoordDOM.getContext('2d')
			};
		}
	}
	render() {
		var { height, width, type } = this.props;
		if (type === "svg") return null;
		return (
			<div>
				<canvas ref="canvas_axes" width={width} height={height}
					style={{ position: "absolute", left: 0, top: 0, zIndex: -1 }} />
				<canvas ref="canvas_mouse_coordinates" width={width} height={height}
					style={{ position: "absolute", left: 0, top: 0, zIndex: -1 }} />
			</div>
		);
	}
}

CanvasContainer.propTypes = {
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
	type: React.PropTypes.string.isRequired,
};

module.exports = CanvasContainer;
