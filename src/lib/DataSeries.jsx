'use strict';

var React = require('react');

var DataSeries = React.createClass({
	propTypes: {
		xAccessor: React.PropTypes.func,
		yAccessor: React.PropTypes.func.isRequired,
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.DataSeries"
		};
	},
	render() {
		var children = React.Children.map(this.props.children, (child) => React.cloneElement(child));
		return (
			<g  style={{ "clipPath": "url(#chart-area-clip)" }}>{children}</g>
		);
	}
});

module.exports = DataSeries;
