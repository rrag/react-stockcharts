"use strict";

import { PropTypes, Component } from "react";
import makeInteractive from "./makeInteractive";
import { noop } from "../utils";

class ClickCallback extends Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}
	onClick(state) {
		var {
			// xScale,
			// plotData,
			mouseXY,
			// currentCharts,
			currentItem,
			chartConfig,
			interactiveState,
			eventMeta,
		} = state;

		var { onClick, displayXAccessor } = this.props;

		var { yScale } = chartConfig;

		var yValue = yScale.invert(mouseXY[1]);
		var xValue = displayXAccessor(currentItem);
		onClick({
			xy: [xValue, yValue],
			mouseXY,
			currentItem
		}, eventMeta);
		return interactiveState;
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

export default makeInteractive(ClickCallback);
