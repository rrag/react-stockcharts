import React, { Component } from "react";
import ReactDOM from "react-dom";

function getDisplayName(Series) {
	var name = Series.displayName || Series.name || "Series";
	return name;
}

export default function fitWidth(WrappedComponent, withRef = true, minWidth = 25) {
	class ResponsiveComponent extends Component {
		constructor(props) {
			super(props);
			this.handleWindowResize = this.handleWindowResize.bind(this);
			this.getWrappedInstance = this.getWrappedInstance.bind(this);
			this.saveNode = this.saveNode.bind(this);
		}
		saveNode(node) {
			this.node = node;
		}
		componentDidMount() {
			window.addEventListener("resize", this.handleWindowResize);
			var el = this.node;
			var w = el.parentNode.clientWidth;

			/* eslint-disable react/no-did-mount-set-state */
			this.setState({
				width: Math.max(w, minWidth)
			});
			/* eslint-enable react/no-did-mount-set-state */
		}
		componentWillUnmount() {
			window.removeEventListener("resize", this.handleWindowResize);
		}
		handleWindowResize() {
			var el = ReactDOM.findDOMNode(this.node); // eslint-disable-line react/no-find-dom-node
			var w = el.parentNode.clientWidth;

			this.setState({
				width: Math.max(w, minWidth)
			});
		}
		getWrappedInstance() {
			return this.node;
		}
		render() {
			var ref = withRef ? { ref: this.saveNode } : {};

			if (this.state && this.state.width) {
				return <WrappedComponent width={this.state.width} {...this.props} {...ref} />;
			} else {
				return <div {...ref} />;
			}
		}
	}

	ResponsiveComponent.displayName = `fitWidth(${ getDisplayName(WrappedComponent) })`;

	return ResponsiveComponent;
}

