"use strict";

import React from "react";
import makeInteractive from "./makeInteractive";
import noop from "../utils/noop";

class ClickCallback extends React.Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}
	onClick({ chartId, xAccessor }, interactive, { mouseXY, currentItem, chartConfig }/* , e */) {
		var { onClick, displayXAccessor } = this.props;

		var { yScale } = chartConfig;

		var yValue = yScale.invert(mouseXY[1]);
		var xValue = displayXAccessor(currentItem);
		onClick({
			xy: [xValue, yValue],
			mouseXY,
			currentItem
		});
		return { interactive }; // returning the same input to indicate that the state of the chart is not changing
	}
	render() {
		return null;
	}
}
ClickCallback.drawOnCanvas = noop;

ClickCallback.propTypes = {
	onClick: React.PropTypes.func.isRequired,
};

ClickCallback.defaultProps = {
	onClick: (e) => { console.log(e); },
};

export default makeInteractive(ClickCallback, ["click"], {});
