'use strict';
var React = require('react');
var ChartTransformer = require('./utils/chart-transformer');
var EventCaptureMixin = require('./mixin/event-capture-mixin');

var polyLinearTimeScale = require('./scale/polylineartimescale');

var doNotPassThrough = ['transformType', 'options', 'children', 'namespace'];

function updatePropsToChild(child, data, props, from, to) {
	if (from === undefined) from = Math.max(data.length - 30, 0);
	if (to === undefined) to = data.length - 1;
	//child.props.data = data.filter();
	if (child.type === Chart.type || child.type === DataTransform.type) {
		child.props.data = data;
		child.props._width = props.width || props._width;
		child.props._height = props.height || props._height;
		child.props._indexAccessor = props._indexAccessor;
		child.props._polyLinear = props.polyLinear;
		if (props.polyLinear)
			child.props._xScale = polyLinearTimeScale(child.props._indexAccessor);
	}
}

var DataTransform = React.createClass({
	mixins: [EventCaptureMixin],
	propTypes: {
		_height: React.PropTypes.number,
		_width: React.PropTypes.number,

		data: React.PropTypes.array.isRequired,
		transformType: React.PropTypes.string.isRequired, // stockscale, none
		options: React.PropTypes.object
	},
	getInitialState() {
		return {};
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.DataTransform",
			transformType: "none"
		};
	},
	componentWillMount() {
		this.transformData(this.props);
	},
	componentWillReceiveProps(nextProps) {
		this.transformData(nextProps);
	},
	transformData(props) {
		var transformer = ChartTransformer.getTransformerFor(props.transformType);
		var passThroughProps = transformer(props.data, props.options)

		this.setState({ passThroughProps: passThroughProps });
	},
	renderChildren(height, width) {
		var children = React.Children.map(this.props.children, (child) => {
			if (typeof child.type === 'string') return child;
			var newChild = child;
			var props = {};
			Object.keys(this.props)
				.filter((eachProp) => doNotPassThrough.indexOf(eachProp) === -1)
				.forEach((key) => props[key] = this.props[key]);

			Object.keys(this.state.passThroughProps)
				.forEach((key) => props[key] = this.state.passThroughProps[key]);

			// console.log(Object.keys(props));
			return React.addons.cloneWithProps(newChild, props);
		});
		return this._renderChildren(children);
	},
	render() {
		return (
			<g>{this.renderChildren()}</g>
		);
	}
});

module.exports = DataTransform;
