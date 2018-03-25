

import React from "react";
import PropTypes from "prop-types";

function ToolTipTSpanLabel(props) {
	return <tspan className="react-stockcharts-tooltip-label" {...props}>{props.children}</tspan>;
}

ToolTipTSpanLabel.propTypes = {
	children: PropTypes.node.isRequired,
	fill: PropTypes.string.isRequired,
};

ToolTipTSpanLabel.defaultProps = {
	fill: "#4682B4"
};

export default ToolTipTSpanLabel;
