'use strict';
var React = require('react');

var MenuItem = React.createClass({
	propTypes: {
		active: React.PropTypes.bool,
		anchor: React.PropTypes.string,
		label: React.PropTypes.string.isRequired
	},
	getDefaultProps() {
		return {
			active: false,
		};
	},
	render() {
		var className = (this.props.active) ? 'active' : '';
		var anchor = this.props.anchor || this.props.label;
		return (
			<li className={className}>
				<a href={'#' + anchor}>{this.props.label}
					{(this.props.active) ? <span className="sr-only">(current)</span> : ''}
				</a>
			</li>
		);
	}
});

module.exports = MenuItem;