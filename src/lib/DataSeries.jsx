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
		return (
			<g  style={{ "clipPath": "url(#chart-area-clip)" }}>{this.props.children}</g>
		);
	}
});

module.exports = DataSeries;
