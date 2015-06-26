"use strict";

import React from "react";

var ChartWidthMixin = {
	getJQuery() {
		return window.$;
	},
	handleWindowResize() {
		var $ = this.getJQuery();
		var w = $(React.findDOMNode(this)).parent().width();
		console.log("width = ", w);

		this.setState({
			width: w
		});
	},
	componentWillUnMount() {
		window.removeEventListener("resize", this.handleWindowResize);
	},
	componentDidMount() {
		window.addEventListener("resize", this.handleWindowResize);
		var $ = this.getJQuery();
		var w = $(React.findDOMNode(this)).parent().width();
		this.setState({
			width: w
		});
	},
};

module.exports = ChartWidthMixin;
