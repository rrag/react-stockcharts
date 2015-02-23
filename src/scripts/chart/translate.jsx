'use strict';
var React = require('react');
var ChartTransformer = require('../utils/chart-transformer');

var polyLinearTimeScale = require('../scale/polylineartimescale');

function updatePropsToChild(child, data, props, from, to) {
	if (from === undefined) from = Math.max(data.length - 30, 0);
	if (to === undefined) to = data.length - 1;
	//child.props.data = data.filter();
	if (child.props.namespace === "ReStock.Chart") {
		child.props.data = data;
		child.props._width = props.width || props._width;
		child.props._height = props.height || props._height;
		child.props._indexAccessor = props._indexAccessor;
		if (props.polyLinear)
			child.props._xScale = polyLinearTimeScale();
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
		_indexAccessor: React.PropTypes.func.isRequired,
		_indexMutator: React.PropTypes.func.isRequired
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.Translate",
			transformDataAs: "none",
			polyLinear: false,
			dateAccesor: (d) => d.date,
			_indexAccessor: (d) => d.index,
			_indexMutator: (d, i) => {d.index = i;}
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
		console.log(props.polyLinear, props.transformDataAs);
		if (props.polyLinear && transformer) {
			data = ChartTransformer.populateDisplayFlags(props.data
				, props.dateAccesor
				, props._indexMutator)
		}
		var data = transformer(props.data);
		if (Array.isArray(props.children)) {
			props.children.forEach(function (child) {
				updatePropsToChild(child, data, props)
			});
		} else {
			updatePropsToChild(props.children, data, props);
		}
	},
	render() {

		return (
			<g>{this.props.children}</g>
		);
	}
});

module.exports = Translate;
