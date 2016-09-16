import React, { Component } from "react";
import ReactDOM from "react-dom";

import { isDefined } from "../utils";

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
			this.saveNode = this.saveNode.bind(this);
			this.setTestCanvas = this.setTestCanvas.bind(this);
			this.state = {};
		}
		saveNode(node) {
			this.node = node;
		}
		setTestCanvas(node) {
			this.testCanvas = node;
		}
		getRatio() {
			if (isDefined(this.testCanvas)) {
				var context = this.testCanvas.getContext("2d");

				var devicePixelRatio = window.devicePixelRatio || 1;
				var backingStoreRatio = context.webkitBackingStorePixelRatio ||
								context.mozBackingStorePixelRatio ||
								context.msBackingStorePixelRatio ||
								context.oBackingStorePixelRatio ||
								context.backingStorePixelRatio || 1;

				var ratio = devicePixelRatio / backingStoreRatio;
				// console.log("ratio = ", ratio);
				return ratio;
			}
			return 1;
		}
		componentDidMount() {
			window.addEventListener("resize", this.handleWindowResize);
			var el = this.node;
			var w = el.parentNode.clientWidth;

			/* eslint-disable react/no-did-mount-set-state */
			this.setState({
				width: w,
				ratio: this.getRatio(),
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
				width: w
			});
		}
		getWrappedInstance() {
			return this.node;
		}
		render() {
			var ref = withRef ? { ref: this.saveNode } : {};

			if (this.state.width) {
				return <WrappedComponent width={this.state.width} ratio={this.state.ratio} {...this.props} {...ref} />;
			} else {
				return <div {...ref}>
					<canvas ref={this.setTestCanvas}  />
				</div>;
			}
		}
	}

	ResponsiveComponent.displayName = `fitWidth(${ getDisplayName(WrappedComponent) })`;

	return ResponsiveComponent;
}

