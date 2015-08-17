"use strict";

import React from "react";

import ChartDataUtil from "./utils/ChartDataUtil";
import PureComponent from "./utils/PureComponent";
import ChartTransformer from "./transforms/ChartTransformer";
import EventHandler from "./EventHandler";
import Utils from "./utils/utils";
import objectAssign from "object-assign";
import shallowEqual from "react/lib/shallowEqual";

class DataTransform extends PureComponent {
	transformData(props, context) {
		var transformer = ChartTransformer.getTransformerFor(props.transformType);

		if (context.dataTransformOptions || props.options) {
			var options = objectAssign(context.dataTransformOptions, props.options);;
		}
		var passThroughProps = transformer(context.data, context.interval, options, context.dataTransformProps);
		return passThroughProps;
	}
	componentWillMount() {
		var { props, context } = this;
		var passThroughProps = this.transformData(props, context);
		this.setState({
			data: passThroughProps.data,
			dataTransformOptions: passThroughProps.options,
			dataTransformProps: passThroughProps.other,
		});
	}
	componentWillReceiveProps(props, context) {
		if (!shallowEqual(this.props, props) || !shallowEqual(this.context, context)) {
			// console.log("DataTransform.componentWillReceiveProps");

			var passThroughProps = this.transformData(props, context);
			this.setState({
				data: passThroughProps.data,
				dataTransformOptions: passThroughProps.options,
				dataTransformProps: passThroughProps.other,
			});
		}
	}
	getChildContext() {
		return {
			data: this.state.data,
			dataTransformOptions: this.state.dataTransformOptions,
			dataTransformProps: this.state.dataTransformProps,
		};
	}
	render() {
		var children = React.Children.map(this.props.children, (child) => {
			var newChild = Utils.isReactVersion13()
				? React.withContext(this.getChildContext(), () => {
					return React.createElement(child.type, objectAssign({ key: child.key, ref: child.ref}, child.props));
				})
				: React.cloneElement(child);
			return newChild;
		});
		return (ChartDataUtil.containsChart(this.props))
			? <EventHandler>{children}</EventHandler>
			: <g>{children}</g>;
	}
}

DataTransform.propTypes = {
	transformType: React.PropTypes.string.isRequired, // stockscale, none
	options: React.PropTypes.object
};

DataTransform.contextTypes = {
	data: React.PropTypes.object.isRequired,
	dataTransformOptions: React.PropTypes.object,
	dataTransformProps: React.PropTypes.object,
	interval: React.PropTypes.string.isRequired,
};

DataTransform.childContextTypes = {
	data: React.PropTypes.object,
	dataTransformOptions: React.PropTypes.object,
	dataTransformProps: React.PropTypes.object,
};

DataTransform.defaultProps = {
	namespace: "ReStock.DataTransform",
	transformType: "none"
};

module.exports = DataTransform;
