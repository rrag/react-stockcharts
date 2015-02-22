'use strict';
var React = require('react');
var ChartTransformer = require('../utils/chart-transformer');

function updatePropsToChild(child, data, props, from, to) {
	if (from === undefined) from = Math.max(data.length - 30, 0);
	if (to === undefined) to = data.length - 1;
	//child.props.data = data.filter();
	if (child.props.namespace === "ReStock.Chart") {
		child.props.data = data;
		child.props._width = props.width || props._width;
		child.props._height = props.height || props._height;
	}
}

var Translate = React.createClass({
	propTypes: {
		data: React.PropTypes.array.isRequired,
		transformDataAs: React.PropTypes.string.isRequired,
		height: React.PropTypes.number,
		width: React.PropTypes.number,
		_height: React.PropTypes.number,
		_width: React.PropTypes.number
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.Translate",
			transformDataAs: "none"
		};
	},
	render() {
		var transformer = ChartTransformer.getTransformerFor(this.props.transformDataAs);
		var data = transformer(this.props.data);
		if (Array.isArray(this.props.children)) {
			this.props.children.forEach(function (d) {
				updatePropsToChild(d, data, this.props)
			});
		} else {
			updatePropsToChild(this.props.children, data, this.props);
		}
		return (
			<g>{this.props.children}</g>
		);
	}
});

module.exports = Translate;
