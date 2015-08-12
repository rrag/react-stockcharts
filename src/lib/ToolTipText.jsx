"use strict";

import React from "react";

class ToolTipText extends React.Component {
	render() {
		return <text 
			fontFamily={this.props.fontFamily}
			fontSize={this.props.fontSize}
			{...this.props} 
			className="react-stockcharts-tooltip">{this.props.children}</text>
	}
}

ToolTipText.propTypes = {
	fontFamily: React.PropTypes.string.isRequired,
	fontSize: React.PropTypes.number.isRequired,
};
ToolTipText.defaultProps = {
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 11,
};

module.exports = ToolTipText;
