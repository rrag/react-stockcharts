"use strict";

import React, { PropTypes, Component } from "react";

import pure from "../pure";
import { isDefined } from "../utils";

function Label(props) {
	var { className, xScale, xValue, yScale, children } = props;
	return <text className={className}
				x={xScale(xValue)} y={yScale.range()[0]}
				textAnchor="middle">&#xe182;</text>
}

Label.propTypes = {
	className: PropTypes.string,
};

Label.defaultProps = {
};

export default Label;