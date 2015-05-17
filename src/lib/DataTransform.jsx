'use strict';
var React = require('react');
var EventCaptureMixin = require('./mixin/EventCaptureMixin');
var ChartContainerMixin = require('./mixin/ChartContainerMixin');
var DataTransformMixin = require('./mixin/DataTransformMixin');

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
	mixins: [DataTransformMixin, ChartContainerMixin, EventCaptureMixin],
	propTypes: {
		_height: React.PropTypes.number,
		_width: React.PropTypes.number,

		data: React.PropTypes.any.isRequired,
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
