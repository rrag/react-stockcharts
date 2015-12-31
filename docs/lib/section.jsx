'use strict';
import React from "react";

class Section extends React.Component {
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
}

Section.propTypes = {
	colSpan: React.PropTypes.number.isRequired,
	title: React.PropTypes.string
};

Section.defaultProps = {
	colSpan: 1
};

export default Section;
