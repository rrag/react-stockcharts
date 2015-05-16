'use strict';
var React = require('react');

var MenuItem = React.createClass({
	propTypes: {
		selectedPage: React.PropTypes.any,
		handleRouteChange: React.PropTypes.func.isRequired,
		page: React.PropTypes.any.isRequired
	},
	getDefaultProps() {
		return {
			active: false,
		};
	},
	handleClick() {
		this.props.handleRouteChange(this.props.page)
	},
	render() {
		var className = (this.props.page === this.props.selectedPage) ? 'active' : '';
		return (
			<li className={className}>
				<a href={'#/' + this.props.page.title} onClick={this.handleClick}>
					{this.props.page.title}
				</a>
			</li>
		);
	}
});

module.exports = MenuItem;