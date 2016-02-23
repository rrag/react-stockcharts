"use strict";

import { PropTypes, Component } from "react";
import makeInteractive from "./makeInteractive";
import { noop } from "../utils";

class ClickCallback extends Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}
	onClick({ chartId, xAccessor }, interactive, { mouseXY, currentItem, chartConfig }, e) {
		var { onClick, displayXAccessor } = this.props;

		var { yScale } = chartConfig;

		var yValue = yScale.invert(mouseXY[1]);
		var xValue = displayXAccessor(currentItem);
		onClick({
			xy: [xValue, yValue],
			mouseXY,
			currentItem
		}, e);
		return { interactive }; // returning the same input to indicate that the state of the chart is not changing
	}
	render() {
		return null;
	}
}

ClickCallback.drawOnCanvas = noop;

ClickCallback.propTypes = {
	onClick: PropTypes.func.isRequired,
	/* comes from pure converted from context to prop - START */
	displayXAccessor: PropTypes.func.isRequired,
	/* comes from pure converted from context to prop - END */
};

ClickCallback.defaultProps = {
	onClick: (e) => { console.log(e); },
};

export default makeInteractive(ClickCallback, ["click"], {});
