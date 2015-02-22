'use strict';
var React = require('react');

var DataSeries = React.createClass({
	propTypes: {
		xAccessor: React.PropTypes.func.isRequired,
		yAccessor: React.PropTypes.func.isRequired
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.DataSeries"
			, xAccessor: function (d) { return d.index; }
			, yAccessor: function (d) { return { open: d.open, close: d.close }; }
		};
	},
	render() {
		return (
			<g>{this.props.children}</g>
		);
	}
});

module.exports = DataSeries;
