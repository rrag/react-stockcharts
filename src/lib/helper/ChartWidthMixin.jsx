"use strict";

import React from "react";
// import ReactDOM from "react-dom";

var ChartWidthMixin = {
	handleWindowResize() {
		var el = React.findDOMNode(this);
		// console.log(this.refs, el, this);

		var w = el.parentNode.clientWidth;
		// console.log("width = ", w);
		this.setState({
			width: w
		});
	},
	componentWillUnmount() {
		// console.log("unmounting...")
		window.removeEventListener("resize", this.handleWindowResize);
	},
	componentDidMount() {
		window.addEventListener("resize", this.handleWindowResize);
		var el = React.findDOMNode(this);
		// console.log(this.refs, el);
		var w = el.parentNode.clientWidth;
		this.setState({
			width: w
		});
	},
};

export default ChartWidthMixin;
