"use strict";

import React, { PropTypes, Component } from "react";

class ToolTipTSpanLabel extends Component {
	render() {
		return <tspan className="react-stockcharts-tooltip-label" fill="#4682B4" {...this.props}>{this.props.children}</tspan>;
	}
}

ToolTipTSpanLabel.propTypes = {
	children: PropTypes.node.isRequired,
};

export default ToolTipTSpanLabel;
