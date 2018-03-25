
import React from "react";

export default class MenuGroup extends React.Component {
	render() {
		return (
			<ul className="nav nav-sidebar">{this.props.children}</ul>
		);
	}
}
