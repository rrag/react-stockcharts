'use strict';
var React = require('react/addons');

var EdgeContainer = React.createClass({
	propTypes: {
		_overlays: React.PropTypes.array.isRequired,
		_currentItem: React.PropTypes.object.isRequired,
		_lastItem: React.PropTypes.object.isRequired,
		_firstItem: React.PropTypes.object.isRequired
		// xScale, yScale, xAccessor
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.EdgeContainer",
		}
	},
	render() {
		return (
			<g>
			</g>
		);
	}
});

module.exports = EdgeContainer;
