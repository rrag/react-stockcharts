'use strict';
var React = require('react');

var MenuGroup = React.createClass({
	render() {
		return (
			<ul className="nav nav-sidebar">{this.props.children}</ul>
		);
	}
});

module.exports = MenuGroup;