
import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../GenericChartComponent";

class SVGComponent extends Component {
	render() {
		const { children } = this.props;
		return <GenericChartComponent
			drawOn={[]}
			svgDraw={children}
		/>;
	}
}

SVGComponent.propTypes = {
	children: PropTypes.func.isRequired,
};

export default SVGComponent;
