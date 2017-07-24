"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";

class TypeChooser extends Component {
	constructor(props) {
		super(props);
		this.state = {
			type: this.props.type
		};
		this.handleTypeChange = this.handleTypeChange.bind(this);
	}
	handleTypeChange(e) {
		// console.log(e.target.value);
		this.setState({
			type: e.target.value
		});
	}
	render() {
		return (
			<div>
				<label>Type: </label>
				<select name="type" id="type" onChange={this.handleTypeChange} value={this.state.type} >
					<option value="svg">svg</option>
					<option value="hybrid">canvas + svg</option>
				</select>
				<div style={this.props.style}>
					{this.props.children(this.state.type)}
				</div>
			</div>
		);
	}
}

TypeChooser.propTypes = {
	type: PropTypes.oneOf(["svg", "hybrid"]),
	children: PropTypes.func.isRequired,
	style: PropTypes.object.isRequired,
};

TypeChooser.defaultProps = {
	type: "hybrid",
	style: {},
};

export default TypeChooser;
