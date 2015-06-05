'use strict';
var React = require('react');
var EventCaptureMixin = require('./mixin/EventCaptureMixin');
var ChartContainerMixin = require('./mixin/ChartContainerMixin');
var DataTransformMixin = require('./mixin/DataTransformMixin');
var ChartTransformer = require('./utils/ChartTransformer');
var Dummy = require('./Dummy');
var Utils = require('./utils/utils');

var polyLinearTimeScale = require('./scale/polylineartimescale');

var doNotPassThrough = ['transformType', 'options', 'children', 'namespace'];

var DataTransform = React.createClass({
	mixins: [/* DataTransformMixin, */ChartContainerMixin, EventCaptureMixin],
	propTypes: {
		transformType: React.PropTypes.string.isRequired, // stockscale, none
		options: React.PropTypes.object
	},
	contextTypes: {
		width: React.PropTypes.number.isRequired,
		height: React.PropTypes.number.isRequired,
		data: React.PropTypes.object.isRequired,
		dataTransformOptions: React.PropTypes.object,
		dataTransformProps: React.PropTypes.object,
		interval: React.PropTypes.string.isRequired,
		initialDisplay: React.PropTypes.number.isRequired,
	},
	getInitialState() {
		return {
			panInProgress: false,
			focus: false
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

		if (context.dataTransformOptions || props.options) {
			var options = {};
			if (context.dataTransformOptions)
				Object.keys(context.dataTransformOptions).forEach((key) => options[key] = context.dataTransformOptions[key]);
			if (props.options)
				Object.keys(props.options).forEach((key) => options[key] = props.options[key]);
		}

		// console.log(options);
		var passThroughProps = transformer(context.data, context.interval, options, context.dataTransformProps)
		// console.log('passThroughProps-------', passThroughProps);

		// this.setState({ passThroughProps: passThroughProps });
		return passThroughProps;
	},
	componentWillMount() {
		var { props, context } = this;
		var passThroughProps = this.transformData(props, context);
		var state = {
			data: passThroughProps.data,
			dataTransformOptions: passThroughProps.options,
			dataTransformProps: passThroughProps.other,
			interval: context.interval
		}
		if (this.containsChart(props)) {
			var data = passThroughProps.data[context.interval];
			var beginIndex = Math.max(data.length - context.initialDisplay, 0);
			var plotData = data.slice(beginIndex);
			var chartData = this.getChartData(props, context, plotData, passThroughProps.data, passThroughProps.other);
			var mainChart = this.getMainChart(props.children);

			state.chartData = chartData;
			state.plotData = plotData;
			state.currentItems = [];
			state.show = false;
			state.mouseXY = [0, 0];
			state.mainChart = mainChart;
		}
		this.setState(state);
	},
	componentWillReceiveProps(props, context) {
		var passThroughProps = this.transformData(props, context);
		var state = {
			data: passThroughProps.data,
			dataTransformOptions: passThroughProps.options,
			dataTransformProps: passThroughProps.other,
			interval: context.interval
		}
		if (this.containsChart(props)) {
			var { interval, chartData, plotData } = this.state

			var data = passThroughProps.data[interval];
			var mainChart = this.getMainChart(props.children);
			var mainChartData = chartData.filter((each) => each.id === mainChart)[0];
			var beginIndex = Utils.getClosestItemIndexes(data, mainChartData.config.accessors.xAccessor(plotData[0]), mainChartData.config.accessors.xAccessor).left;
			var endIndex = Utils.getClosestItemIndexes(data, mainChartData.config.accessors.xAccessor(plotData[plotData.length - 1]), mainChartData.config.accessors.xAccessor).right;

			var plotData = data.slice(beginIndex, endIndex);
			var chartData = this.getChartData(props, context, plotData, passThroughProps.data, passThroughProps.other);

			state.chartData = chartData;
			state.plotData = plotData;
			state.currentItems = [];
			state.show = false;
			state.mouseXY = [0, 0];
			state.mainChart = mainChart;
		}
		this.setState(state);
	},
	childContextTypes: {
		data: React.PropTypes.object,
		dataTransformOptions: React.PropTypes.object,
		dataTransformProps: React.PropTypes.object,
		// plotData: React.PropTypes.array, // Deprecated
		plotData: React.PropTypes.array,
		// chartData: React.PropTypes.array, // Deprecated
		chartData: React.PropTypes.array,
		// currentItems: React.PropTypes.array, // Deprecated
		currentItems: React.PropTypes.array,
		// show: React.PropTypes.bool,  // Deprecated
		show: React.PropTypes.bool,
		// mouseXY: React.PropTypes.array, // Deprecated
		mouseXY: React.PropTypes.array,
		interval: React.PropTypes.string,
	},
	getChildContext() {
		return {
			data: this.state.data,
			dataTransformOptions: this.state.dataTransformOptions,
			dataTransformProps: this.state.dataTransformProps,
			// plotData: this.state.plotData, // Deprecated
			plotData: this.state.plotData,
			chartData: this.state.chartData, // Deprecated
			// chartData: this.state.chartData,
			// currentItems: this.state.currentItems, // Deprecated
			currentItems: this.state.currentItems,
			// show: this.state.show, // Deprecated
			show: this.state.show,
			// mouseXY: this.state.mouseXY, // Deprecated
			mouseXY: this.state.mouseXY,
			interval: this.state.interval,
		}
	},
	render() {
		// console.log('DataTransform.render()');
		// console.error('foobar');
		var children = React.Children.map(this.props.children, (child) => React.cloneElement(child));
		// var children = this.props.children;
		return (
			<g>{children}</g>
		);
	}/*
	render() {
		// console.log('DataTransform.render()');
		// console.error('foobar');
		var children = React.Children.map(this.props.children, (child) => React.cloneElement(child));
		// var children = this.props.children;
		return (
			<Dummy contextProps={this.getCh22ildContext()} render={() => <g>{children}</g>} />
		);
	}*/
});

module.exports = DataTransform;
