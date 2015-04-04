'use strict';
var React = require('react');

var Section = React.createClass({
	propTypes: {
		colSpan: React.PropTypes.number.isRequired,
		title: React.PropTypes.string
	},
	getDefaultProps() {
		return {
			colSpan: 1
		}
	},
	render() {
		var className = this.props.className + ' col-md-' + (6 * this.props.colSpan);
		var title = this.props.title ? <h4>{this.props.title}</h4> : null;
		return (
			<div className={className}>
				{title}
				{this.props.children}
			</div>
		);
	}
});

module.exports = Section;
