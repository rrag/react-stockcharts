"use strict";
import React from "react";
import PropTypes from "prop-types";

class Row extends React.Component {
	render() {
		const anchor = this.props.anchor || this.props.title;
		const title = this.props.title
				? <h4><a id={anchor} href={"#" + anchor}>{this.props.title}</a></h4>
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
	title: PropTypes.string,
	anchor: PropTypes.string
};

export default Row;