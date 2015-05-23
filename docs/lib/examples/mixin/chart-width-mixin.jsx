'use strict';

var React = require('react');

var ChartWidthMixin = {
	handleWindowResize() {
		// 
		var w = $(React.findDOMNode(this)).parent().width();
		//var w = $(this.getDOMNode()).parent().width();
		console.log('width = ', w);

		this.setState({
			width: w
		});
	},
	componentWillUnMount() {
		window.removeEventListener("resize", this.handleWindowResize);
	},
	componentDidMount() {
		window.addEventListener("resize", this.handleWindowResize);
		var w = $(React.findDOMNode(this)).parent().width();
		//var w = $(this.getDOMNode()).parent().width();
		this.setState({
			width: w
		});
	},
};

module.exports = ChartWidthMixin;