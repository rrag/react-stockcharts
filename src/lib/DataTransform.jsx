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
		_width: React.PropTypes.number.isRequired,
		_height: React.PropTypes.number.isRequired,
		data: React.PropTypes.object.isRequired,
		dataTransformOptions: React.PropTypes.object,
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
		var passThroughProps = transformer(context.data[context.interval], props.options, props)
		// console.log('passThroughProps-------', passThroughProps);

		// this.setState({ passThroughProps: passThroughProps });
		return passThroughProps;
	},
	componentWillMount() {
		var { props, context } = this;
		var passThroughProps = this.transformData(props, context);
		var state = {
			data: passThroughProps.data,
			dataTransformOptions: passThroughProps.options
		}
		if (this.containsChart(props)) {
			var data = passThroughProps.data[context.interval];
			var beginIndex = Math.max(data.length - context.initialDisplay, 0);
			var partialData = data.slice(beginIndex);
			var chartData = this.getChartData(props, context, partialData, passThroughProps.data, passThroughProps.other);
			var mainChart = this.getMainChart(props.children);

			state._chartData = chartData;
			state._data = partialData;
			state._currentItems = [];
			state._show = false;
			state._mouseXY = [0, 0];
			state.interval = context.interval;
			state.mainChart = mainChart;
		}
		this.setState(state);
	},
	componentWillReceiveProps(props, context) {
		var passThroughProps = this.transformData(props, context);
		var state = {
			data: passThroughProps.data,
			dataTransformOptions: passThroughProps.options
		}
		if (this.containsChart(props)) {
			var { interval, _chartData, _data } = this.state

			var data = passThroughProps.data[interval];
			var mainChart = this.getMainChart(props.children);
			var mainChartData = _chartData.filter((each) => each.id === mainChart)[0];
			var beginIndex = Utils.getClosestItemIndexes(data, mainChartData.config.accessors.xAccessor(_data[0]), mainChartData.config.accessors.xAccessor).left;
			var endIndex = Utils.getClosestItemIndexes(data, mainChartData.config.accessors.xAccessor(_data[_data.length - 1]), mainChartData.config.accessors.xAccessor).right;

			var partialData = data.slice(beginIndex, endIndex);
			var chartData = this.getChartData(props, context, partialData, passThroughProps.data, passThroughProps.other);

			state._chartData = chartData;
			state._data = partialData;
			state._currentItems = [];
			state._show = false;
			state._mouseXY = [0, 0];
			state.interval = context.interval;
			state.mainChart = mainChart;
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

		// EventCaptureMixin
		onMouseMove: React.PropTypes.func,
		onMouseEnter: React.PropTypes.func,
		onMouseLeave: React.PropTypes.func,
		onZoom: React.PropTypes.func,
		onPanStart: React.PropTypes.func,
		onPan: React.PropTypes.func,
		onPanEnd: React.PropTypes.func,
		panInProgress: React.PropTypes.bool.isRequired,
		focus: React.PropTypes.bool.isRequired,
		onFocus: React.PropTypes.func,
	},
	getChildContext() {
		// console.log(this.context._width);

		return {
			data: this.state.data,
			dataTransformOptions: this.state.dataTransformOptions,
			_data: this.state._data,
			_chartData: this.state._chartData,
			_currentItems: this.state._currentItems,
			_show: this.state._show,
			_mouseXY: this.state._mouseXY,
			interval: this.state.interval,

			// EventCaptureMixin
			onMouseMove: this.handleMouseMove,
			onMouseEnter: this.handleMouseEnter,
			onMouseLeave: this.handleMouseLeave,
			onZoom: this.handleZoom,
			onPanStart: this.handlePanStart,
			onPan: this.handlePan,
			onPanEnd: this.handlePanEnd,
			onFocus: this.handleFocus,
			panInProgress: this.state.panInProgress,
			focus: this.state.focus
		}
	},/* */
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
