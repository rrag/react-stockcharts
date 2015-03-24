'use strict';

var ChartWidthMixin = {
	handleWindowResize() {
		var w = $(this.getDOMNode()).parent().width();
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
		var w = $(this.getDOMNode()).parent().width();
		this.setState({
			width: w
		});
	},
};

module.exports = ChartWidthMixin;