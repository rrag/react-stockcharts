"use strict";

import React from "react";

class CanvasContainer extends React.Component {
	getCanvasContexts() {
		if (this.refs.canvas_axes) {
			return {
				axes: this.refs.canvas_axes.getContext('2d'),
				mouseCoord: this.refs.canvas_mouse_coordinates.getContext('2d')
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
