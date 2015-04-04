'use strict';
var React = require('react');
var EventCaptureMixin = require('./mixin/event-capture-mixin');
var ChartContainerMixin = require('./mixin/chart-container-mixin');
var DataTransformMixin = require('./mixin/data-transform-mixin');

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

var DataTransform = React.createClass({displayName: "DataTransform",
	mixins: [DataTransformMixin, ChartContainerMixin, EventCaptureMixin],
	propTypes: {
		_height: React.PropTypes.number,
		_width: React.PropTypes.number,

		data: React.PropTypes.array.isRequired,
		transformType: React.PropTypes.string.isRequired, // stockscale, none
		options: React.PropTypes.object
	},
	getInitialState:function() {
		return {};
	},
	getDefaultProps:function() {
		return {
			namespace: "ReStock.DataTransform",
			transformType: "none"
		};
	},

	renderChildren:function(height, width) {
		var children = React.Children.map(this.props.children, function(child)  {
			if (typeof child.type === 'string') return child;
			var newChild = child;
			var props = {};
			Object.keys(this.props)
				.filter(function(eachProp)  {return doNotPassThrough.indexOf(eachProp) === -1;})
				.forEach(function(key)  {return props[key] = this.props[key];}.bind(this));

			Object.keys(this.state.passThroughProps)
				.forEach(function(key)  {return props[key] = this.state.passThroughProps[key];}.bind(this));

			// console.log(Object.keys(props));
			return React.addons.cloneWithProps(newChild, props);
		}.bind(this));
		return this._renderChildren(children);
	},
	render:function() {
		return (
			React.createElement("g", null, this.renderChildren())
		);
	}
});

module.exports = DataTransform;
