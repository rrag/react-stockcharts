'use strict';
import React from "react";

class MenuItem extends React.Component {
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
}

MenuItem.propTypes = {
	current: React.PropTypes.bool.isRequired,
	title: React.PropTypes.string.isRequired,
	anchor: React.PropTypes.string.isRequired,
};

MenuItem.defaultProps = {
	active: false,
};


// onClick={this.handleClick}
export default MenuItem;
