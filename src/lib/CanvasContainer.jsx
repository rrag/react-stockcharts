"use strict";

import React from "react";

class CanvasContainer extends React.Component {
	getCanvasContexts() {

		var {
			canvas_axes: axesCanvasDOM,
			canvas_mouse_coordinates: mouseCoordDOM,
			canvas_interactive: interactiveDOM,
			bg: bgDOM
		} = this.refs;

		if (this.refs.canvas_axes) {
			return {
				axes: axesCanvasDOM.getContext("2d"),
				mouseCoord: mouseCoordDOM.getContext("2d"),
				interactive: interactiveDOM.getContext("2d"),
				bg: bgDOM.getContext("2d"),
			};
		}
	}
	render() {
		var { height, width, type, zIndex } = this.props;
		if (type === "svg") return null;
		return (
			<div style={{ zIndex: zIndex }}>
				<canvas ref="bg" width={width} height={height}
					style={{ position: "absolute", left: 0, top: 0 }} />
				<canvas ref="canvas_axes" width={width} height={height}
					style={{ position: "absolute", left: 0, top: 0 }} />
				<canvas ref="canvas_mouse_coordinates" width={width} height={height}
					style={{ position: "absolute", left: 0, top: 0 }} />
				<canvas ref="canvas_interactive" width={width} height={height}
					style={{ position: "absolute", left: 0, top: 0 }} />
			</div>
		);
	}
}

CanvasContainer.propTypes = {
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
	type: React.PropTypes.string.isRequired,
	zIndex: React.PropTypes.number,
};

export default CanvasContainer;
