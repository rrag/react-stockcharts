"use strict";
import React from "react";

import Row from "lib/row";

export default class MainContainer extends React.Component {
	render() {
		return (
			<div className="container-fluid" id="MainContainer">
				<Row>{this.props.children}</Row>
			</div>
		);
	}
}