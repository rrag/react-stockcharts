'use strict';
var React = require('react');

var ContentSection = React.createClass({
	propTypes: {
		title: React.PropTypes.string.isRequired
	},
	render() {
		var { className } = this.props;
		return (
			<div id="ContentSection" className={`col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main ${ className }`}>
				<h1 className="page-header">{this.props.title}</h1>
				{this.props.children}
			</div>
		);
	}
});

module.exports = ContentSection;