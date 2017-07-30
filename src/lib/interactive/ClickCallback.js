"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";

import { noop } from "../utils";
import GenericChartComponent from "../GenericChartComponent";
import { getMouseCanvas } from "../GenericComponent";

class ClickCallback extends Component {
	render() {
		const {
			onMouseDown,
			onClick,
			onDoubleClick,
			onContextMenu,
			onMouseMove,
			onPan,
			onPanEnd,
		} = this.props;

		return <GenericChartComponent

			onMouseDown={onMouseDown}
			onClick={onClick}
			onDoubleClick={onDoubleClick}
			onContextMenu={onContextMenu}
			onMouseMove={onMouseMove}
			onPan={onPan}
			onPanEnd={onPanEnd}

			svgDraw={noop}
			canvasDraw={noop}
			canvasToDraw={getMouseCanvas}

			drawOn={["mousemove", "pan"]}
		/>;
	}
}

ClickCallback.propTypes = {
	disablePan: PropTypes.bool.isRequired,
	onMouseDown: PropTypes.func,
	onClick: PropTypes.func,
	onDoubleClick: PropTypes.func,
	onContextMenu: PropTypes.func,
	onMouseMove: PropTypes.func,
	onPan: PropTypes.func,
	onPanEnd: PropTypes.func,
};

ClickCallback.defaultProps = {
	disablePan: false,
};

export default ClickCallback;
