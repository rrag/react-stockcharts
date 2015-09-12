'use strict';
var React = require('react');

var Nav = React.createClass({
	render() {
		return (
			<nav className="navbar navbar-fixed-top">
				<div className="container-fluid">
					<div className="navbar-header">
						<a className="navbar-brand" href="index.html">React Stockcharts</a>
						<div id="debug_here"></div>
					</div>
				</div>
			</nav>
		);
	}
});

module.exports = Nav;