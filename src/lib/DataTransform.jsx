'use strict';
var React = require('react');
var EventCaptureMixin = require('./mixin/EventCaptureMixin');
var ChartContainerMixin = require('./mixin/ChartContainerMixin');
var DataTransformMixin = require('./mixin/DataTransformMixin');

var polyLinearTimeScale = require('./scale/polylineartimescale');

var doNotPassThrough = ['transformType', 'options', 'children', 'namespace'];

var DataTransform = React.createClass({
	mixins: [DataTransformMixin, ChartContainerMixin, EventCaptureMixin],
	propTypes: {
		data: React.PropTypes.any.isRequired,
		transformType: React.PropTypes.string.isRequired, // stockscale, none
		options: React.PropTypes.object
	},
	contextTypes: {
		_width: React.PropTypes.number.isRequired,
		_height: React.PropTypes.number.isRequired
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
			return React.cloneElement(newChild, props);
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
