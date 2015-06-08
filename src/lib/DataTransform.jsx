'use strict';
var React = require('react');
var ChartDataUtil = require('./utils/ChartDataUtil');
var ChartTransformer = require('./utils/ChartTransformer');
var EventHandler = require('./EventHandler');
var Utils = require('./utils/utils');

class DataTransform extends React.Component {
	transformData(props, context) {
		var transformer = ChartTransformer.getTransformerFor(props.transformType);

		if (context.dataTransformOptions || props.options) {
			var options = {};
			if (context.dataTransformOptions)
				Object.keys(context.dataTransformOptions).forEach((key) => options[key] = context.dataTransformOptions[key]);
			if (props.options)
				Object.keys(props.options).forEach((key) => options[key] = props.options[key]);
		}

		var passThroughProps = transformer(context.data, context.interval, options, context.dataTransformProps)
		return passThroughProps;
	}
	componentWillMount() {
		var { props, context } = this;
		var passThroughProps = this.transformData(props, context);
		this.setState({
			data: passThroughProps.data,
			dataTransformOptions: passThroughProps.options,
			dataTransformProps: passThroughProps.other,
			interval: context.interval
		});
	}
	componentWillReceiveProps(props, context) {
		var passThroughProps = this.transformData(props, context);
		this.setState({
			data: passThroughProps.data,
			dataTransformOptions: passThroughProps.options,
			dataTransformProps: passThroughProps.other,
			interval: context.interval
		});
	}
	getChildContext() {
		return {
			data: this.state.data,
			dataTransformOptions: this.state.dataTransformOptions,
			dataTransformProps: this.state.dataTransformProps,
			interval: this.state.interval,
		}
	}
	render() {
		var children = React.Children.map(this.props.children, (child) => {
			var newChild = Utils.isReactVersion13()
				? React.withContext(this.getChildContext(), () => {
					return React.createElement(child.type, Utils.mergeObject({ key: child.key, ref: child.ref}, child.props));
				})
				: React.cloneElement(child);
			return newChild;
		});
		return (ChartDataUtil.containsChart(this.props))
			? <EventHandler>{children}</EventHandler>
			: <g>{children}</g>;
	}
};

DataTransform.propTypes = {
	transformType: React.PropTypes.string.isRequired, // stockscale, none
	options: React.PropTypes.object
}
DataTransform.contextTypes = {
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
	data: React.PropTypes.object.isRequired,
	dataTransformOptions: React.PropTypes.object,
	dataTransformProps: React.PropTypes.object,
	interval: React.PropTypes.string.isRequired,
	initialDisplay: React.PropTypes.number.isRequired,
}
DataTransform.childContextTypes = {
	data: React.PropTypes.object,
	dataTransformOptions: React.PropTypes.object,
	dataTransformProps: React.PropTypes.object,
	interval: React.PropTypes.string,
}
DataTransform.defaultProps = {
	namespace: "ReStock.DataTransform",
	transformType: "none"
}

module.exports = DataTransform;
