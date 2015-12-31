'use strict';
import React from "react";

class Row extends React.Component {
	render() {
		var anchor = this.props.anchor || this.props.title;
		var title = this.props.title
				? <h4><a id={anchor} href={'#' + anchor}>{this.props.title}</a></h4>
				: null;

		return (
			<div className="row">
				{title}
				{this.props.children}
			</div>
		);
	}
}

Row.propTypes = {
	title: React.PropTypes.string,
	anchor: React.PropTypes.string
};

export default Row;