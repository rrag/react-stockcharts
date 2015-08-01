"use strict";

import React from "react";

class ToolTipText extends React.Component {
	render() {
		return <text {...this.props} className="react-stockcharts-tooltip" fontSize="11px">{this.props.children}</text>
	}
}

module.exports = ToolTipText;
