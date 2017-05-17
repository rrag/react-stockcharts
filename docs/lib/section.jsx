'use strict';
import React from "react";
import PropTypes from 'prop-types';

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
	colSpan: PropTypes.number.isRequired,
	title: PropTypes.string
};

Section.defaultProps = {
	colSpan: 1
};

export default Section;
