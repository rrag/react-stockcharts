"use strict";

import React, { PropTypes, Component } from "react";

class ToolTipText extends Component {
	render() {
		return <text
			fontFamily={this.props.fontFamily}
			fontSize={this.props.fontSize}
			{...this.props}
			className="react-stockcharts-tooltip">{this.props.children}</text>;
	}
}

ToolTipText.propTypes = {
	fontFamily: PropTypes.string.isRequired,
	fontSize: PropTypes.number.isRequired,
	children: PropTypes.node.isRequired,
};

ToolTipText.defaultProps = {
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 11,
};

export default ToolTipText;
