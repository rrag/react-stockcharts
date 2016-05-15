"use strict";

import React, { PropTypes } from "react";

import PureComponent from "../utils/PureComponent";

class TooltipContainer extends PureComponent {
	render() {
		return (
			<g className="react-stockcharts-toottip-hover">
				{this.props.children}
			</g>
		);
	}
}

TooltipContainer.contextTypes = {
	chartConfig: PropTypes.array.isRequired,
	currentItem: PropTypes.object,
};

export default TooltipContainer;
