'use strict';
var React = require('react');

var MenuItem = React.createClass({
	propTypes: {
		current: React.PropTypes.bool.isRequired,
		title: React.PropTypes.string.isRequired,
		anchor: React.PropTypes.string.isRequired,
	},
	getDefaultProps() {
		return {
			active: false,
		};
	},
	render() {
		var className = this.props.current ? 'active' : '';
		return (
			<li className={className}>
				<a href={'#/' + this.props.anchor}>
					{this.props.title}
				</a>
			</li>
		);
	}
});
// onClick={this.handleClick}
module.exports = MenuItem;