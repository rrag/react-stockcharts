'use strict';
var React = require('react');

var MainContainer = React.createClass({
	render() {
		return (
			<div className="container-fluid">
				<div className="row">{this.props.children}</div>
			</div>
		);
	}
});

module.exports = MainContainer;