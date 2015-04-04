'use strict';
var React = require('react');
var Row = require('lib/row');

var MainContainer = React.createClass({
	render() {
		return (
			<div className="container-fluid" id="MainContainer">
				<Row>{this.props.children}</Row>
			</div>
		);
	}
});

module.exports = MainContainer;