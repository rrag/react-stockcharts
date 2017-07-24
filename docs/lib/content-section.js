"use strict";

import React from "react";
import PropTypes from "prop-types";

class ContentSection extends React.Component {
	render() {
		const { className } = this.props;
		return (
			<div id="ContentSection" className={`col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main ${ className }`}>
				<h1 className="page-header">{this.props.title}</h1>
				{this.props.children}
			</div>
		);
	}
}

ContentSection.propTypes = {
	title: PropTypes.string.isRequired
};

export default ContentSection;