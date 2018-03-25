
import React from "react";

export default class Nav extends React.Component {
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
}
