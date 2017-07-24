import React, { Component } from "react";
import ReactDOM from "react-dom";

import { isDefined } from "../utils";

function getDisplayName(Series) {
	const name = Series.displayName || Series.name || "Series";
	return name;
}

export default function fitWidth(WrappedComponent, withRef = true, minWidth = 100) {
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
				const context = this.testCanvas.getContext("2d");

				const devicePixelRatio = window.devicePixelRatio || 1;
				const backingStoreRatio = context.webkitBackingStorePixelRatio ||
								context.mozBackingStorePixelRatio ||
								context.msBackingStorePixelRatio ||
								context.oBackingStorePixelRatio ||
								context.backingStorePixelRatio || 1;

				const ratio = devicePixelRatio / backingStoreRatio;
				// console.log("ratio = ", ratio);
				return ratio;
			}
			return 1;
		}
		componentDidMount() {
			window.addEventListener("resize", this.handleWindowResize);
			const el = this.node;
			const w = el.parentNode.clientWidth;

			/* eslint-disable react/no-did-mount-set-state */
			this.setState({
				width: Math.max(w, minWidth),
				ratio: this.getRatio(),
			});
			/* eslint-enable react/no-did-mount-set-state */
		}
		componentWillUnmount() {
			window.removeEventListener("resize", this.handleWindowResize);
		}
		handleWindowResize() {
			const el = ReactDOM.findDOMNode(this.node); // eslint-disable-line react/no-find-dom-node
			const w = el.parentNode.clientWidth;

			if (w > minWidth) {
				this.setState({
					width: w
				});
			}
		}
		getWrappedInstance() {
			return this.node;
		}
		render() {
			const ref = withRef ? { ref: this.saveNode } : {};

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

