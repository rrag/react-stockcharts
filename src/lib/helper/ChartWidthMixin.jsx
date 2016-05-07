"use strict";

import ReactDOM from "react-dom";

var ChartWidthMixin = {
	handleWindowResize() {
		var el = ReactDOM.findDOMNode(this);
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
		var el = ReactDOM.findDOMNode(this);
		// console.log(this.refs, el);
		var w = el.parentNode.clientWidth;

		/* eslint-disable react/no-did-mount-set-state */
		this.setState({
			width: w
		});
		/* eslint-enable react/no-did-mount-set-state */
	},
};

export default ChartWidthMixin;
