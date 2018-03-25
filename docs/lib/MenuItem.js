
import React from "react";
import PropTypes from "prop-types";


class MenuItem extends React.Component {
	render() {
		const className = this.props.current ? "active" : "";
		return (
			<li className={className}>
				<a href={"#/" + this.props.anchor}>
					{this.props.title}
				</a>
			</li>
		);
	}
}

MenuItem.propTypes = {
	current: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	anchor: PropTypes.string.isRequired,
};

MenuItem.defaultProps = {
	active: false,
};


// onClick={this.handleClick}
export default MenuItem;
