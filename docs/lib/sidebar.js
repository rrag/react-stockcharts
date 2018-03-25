
import React from "react";

export default class SideBar extends React.Component {
	render() {
		return (
			<div className="col-sm-3 col-md-2 sidebar">{this.props.children}</div>
		);
	}
}
