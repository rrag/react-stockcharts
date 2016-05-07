import React, { Component } from "react";
import ReactDOM from "react-dom";

function getDisplayName(Series) {
	var name = Series.displayName || Series.name || "Series";
	return name;
}

export default function fitWidth(WrappedComponent, withRef = true) {
	class ResponsiveComponent extends Component {
		constructor(props) {
			super(props);
			this.handleWindowResize = this.handleWindowResize.bind(this);
			this.getWrappedInstance = this.getWrappedInstance.bind(this);
		}
		componentDidMount() {
			window.addEventListener("resize", this.handleWindowResize);
			var el = ReactDOM.findDOMNode(this);
			var w = el.parentNode.clientWidth;

			/* eslint-disable react/no-did-mount-set-state */
			this.setState({
				width: w
			});
			/* eslint-enable react/no-did-mount-set-state */
		}
		componentWillUnmount() {
			window.removeEventListener("resize", this.handleWindowResize);
		}
		handleWindowResize() {
			var el = ReactDOM.findDOMNode(this);
			var w = el.parentNode.clientWidth;
			this.setState({
				width: w
			});
		}
		getWrappedInstance() {
			return this.refs.component;
		}
		render() {
			var ref = withRef ? { ref: "component" } : {};

			if (this.state && this.state.width) {
				return <WrappedComponent width={this.state.width} {...this.props} {...ref} />;
			} else {
				return <div />;
			}
		}
	}

	ResponsiveComponent.displayName = `fitWidth(${ getDisplayName(WrappedComponent) })`;

	return ResponsiveComponent;
}

