"use strict";

import React from "react";
import PropTypes from "prop-types";

function ToolTipTSpanLabel(props) {
	return <tspan className="react-stockcharts-tooltip-label" fill="#4682B4" {...props}>{props.children}</tspan>;
}

ToolTipTSpanLabel.propTypes = {
	children: PropTypes.node.isRequired,
};

export default ToolTipTSpanLabel;
