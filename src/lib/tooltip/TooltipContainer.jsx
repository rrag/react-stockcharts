"use strict";

import React from "react";

import PureComponent from "../utils/PureComponent";
import objectAssign from "object-assign";

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
	chartConfig: React.PropTypes.array.isRequired,
	currentItem: React.PropTypes.object.isRequired,
};

export default TooltipContainer;
