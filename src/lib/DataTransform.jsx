'use strict';
var React = require('react');
var EventCaptureMixin = require('./mixin/EventCaptureMixin');
var ChartContainerMixin = require('./mixin/ChartContainerMixin');
var DataTransformMixin = require('./mixin/DataTransformMixin');
var ChartTransformer = require('./utils/ChartTransformer');

var polyLinearTimeScale = require('./scale/polylineartimescale');

var doNotPassThrough = ['transformType', 'options', 'children', 'namespace'];

var DataTransform = React.createClass({
	mixins: [/* DataTransformMixin, */ChartContainerMixin, EventCaptureMixin],
	propTypes: {
		transformType: React.PropTypes.string.isRequired, // stockscale, none
		options: React.PropTypes.object
	},
	contextTypes: {
		_width: React.PropTypes.number.isRequired,
		_height: React.PropTypes.number.isRequired,
		data: React.PropTypes.object.isRequired,
		dataTransformOptions: React.PropTypes.object,
		interval: React.PropTypes.string.isRequired
	},
	getInitialState() {
		return {
			panInProgress: false
		};
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.DataTransform",
			transformType: "none"
		};
	},
	transformData(props, context) {
		var transformer = ChartTransformer.getTransformerFor(props.transformType);
		var passThroughProps = transformer(context.data[context.interval], props.options, props)
		// console.log('passThroughProps-------', passThroughProps);

		// this.setState({ passThroughProps: passThroughProps });
		return passThroughProps;
	},
	componentWillMount() {
		var passThroughProps = this.transformData(this.props, this.context);
		// console.log(passThroughProps);
		var state = {
			data: passThroughProps.data,
			dataTransformOptions: passThroughProps.options
		}
		if (this.containsChart(this.props)) {
			var data = passThroughProps.data[this.context.interval];
			var chartData = this.getChartData(this.props, this.context, data, passThroughProps.data, passThroughProps.other);
			console.log(chartData);
			state._chartData = chartData;
			state._data = data;
			state._currentItems = [];
			state._show = false;
			state._mouseXY = [0, 0];
			state.interval = this.context.interval;
		}

		this.setState(state);
	},
	childContextTypes: {
		data: React.PropTypes.object,
		dataTransformOptions: React.PropTypes.object,
		_data: React.PropTypes.array,
		_chartData: React.PropTypes.array,
		_currentItems: React.PropTypes.array,
		_show: React.PropTypes.bool,
		_mouseXY: React.PropTypes.array,
		interval: React.PropTypes.string,
	},
	getChildContext() {
		return {
			data: this.state.data,
			dataTransformOptions: this.state.dataTransformOptions,
			_data: this.state._data,
			_chartData: this.state._chartData,
			_currentItems: this.state._currentItems,
			_show: this.state._show,
			_mouseXY: this.state._mouseXY,
			interval: this.state.interval
		}
	},
	render() {
		console.log('DataTransform.render()');
		// console.error('foobar');
		var children = React.Children.map(this.props.children, (child) => React.cloneElement(child));
		// var children = this.props.children;
		return (
			<g>{children}</g>
		);
	}
});

module.exports = DataTransform;
