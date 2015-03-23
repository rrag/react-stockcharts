'use strict';
var React = require('react');

var Row = React.createClass({
	propTypes: {
		title: React.PropTypes.string,
		anchor: React.PropTypes.string
	},
	render() {
		var anchor = this.props.anchor || this.props.title;
		var title = this.props.title
				? <h4><a id={anchor} href={'#' + anchor}>{this.props.title}</a></h4>
				: null;

		return (
			<div className="row" style={{ height: 600 }}>
				{title}
				{this.props.children}
			</div>
		);
	}
});

module.exports = Row;