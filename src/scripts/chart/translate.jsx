'use strict';
var React = require('react');
var ChartTransformer = require('../utils/chart-transformer');

var polyLinearTimeScale = require('../scale/polylineartimescale');
var Chart = require('./chart');

function updatePropsToChild(child, data, props, from, to) {
	if (from === undefined) from = Math.max(data.length - 30, 0);
	if (to === undefined) to = data.length - 1;
	//child.props.data = data.filter();
	if (child.props.namespace === "ReStock.Chart") {
		child.props.data = data;
		child.props._width = props.width || props._width;
		child.props._height = props.height || props._height;
		child.props._indexAccessor = props._indexAccessor;
		child.props._polyLinear = props.polyLinear;
		if (props.polyLinear)
			child.props._xScale = polyLinearTimeScale(child.props._indexAccessor);
	}
}

var Translate = React.createClass({
	propTypes: {
		data: React.PropTypes.array.isRequired,
		transformDataAs: React.PropTypes.string.isRequired,
		height: React.PropTypes.number,
		width: React.PropTypes.number,
		_height: React.PropTypes.number,
		_width: React.PropTypes.number,
		polyLinear: React.PropTypes.bool.isRequired,
		dateAccesor: React.PropTypes.func.isRequired,
		viewRange: React.PropTypes.object,
		_indexAccessor: React.PropTypes.func.isRequired,
		_indexMutator: React.PropTypes.func.isRequired,
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.Translate",
			transformDataAs: "none",
			polyLinear: false,
			dateAccesor: (d) => d.date,
			_indexAccessor: (d) => d._idx,
			_indexMutator: (d, i) => {d._idx = i;}
		};
	},
	componentWillMount() {
		this.updatePropsToChild(this.props);
	},
	componentWillReceiveProps(nextProps) {
		this.updatePropsToChild(nextProps);
	},
	updatePropsToChild(props) {
		var transformer = ChartTransformer.getTransformerFor(props.transformDataAs);
		var data = props.data;
		if (props.polyLinear && transformer) {
			data = ChartTransformer.populateDisplayFlags(props.data
				, props.dateAccesor
				, props._indexMutator)
		}
		data = transformer(data);
		data = ChartTransformer.filter(data, props.dateAccesor, props.viewRange.from, props.viewRange.to);
		var children = Array.isArray(props.children) ? props.children : [props.children];

		children.forEach(function (child) {
			console.log(typeof child)
			console.log(child instanceof Chart)
			updatePropsToChild(child, data, props)
		});
	},
	render() {

		return (
			<g>{this.props.children}</g>
		);
	}
});

module.exports = Translate;
