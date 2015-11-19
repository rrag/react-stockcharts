import React from "react";

function getDisplayName(Series) {
	var name = Series.displayName || Series.name || "Series";
	return name;
}

export default function fitWidth(Component, withRef = true) {
	class ResponsiveComponent extends React.Component {
		constructor(props) {
			super(props);
			this.handleWindowResize = this.handleWindowResize.bind(this);
			this.getWrappedInstance = this.getWrappedInstance.bind(this);
		}
		componentDidMount() {
			window.addEventListener("resize", this.handleWindowResize);
			var el = React.findDOMNode(this);
			var w = el.parentNode.clientWidth;
			this.setState({
				width: w
			});
		}
		componentWillUnmount() {
			window.removeEventListener("resize", this.handleWindowResize);
		}
		handleWindowResize() {
			var el = React.findDOMNode(this);
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
				return <Component width={this.state.width} {...this.props} {...ref} />;
			} else {
				return <div />;
			}
		}
	}

	ResponsiveComponent.displayName = `fitWidth(${ getDisplayName(Component) })`;

	return ResponsiveComponent;
}

