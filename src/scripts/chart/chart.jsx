'use strict';
var React = require('react');
var d3 = require('d3');

var polyLinearTimeScale = require('../scale/polylineartimescale');
var ScaleUtils = require('../utils/scale-utils');

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

var Chart = React.createClass({
	propTypes: {
		data: React.PropTypes.array.isRequired,
		height: React.PropTypes.number,
		width: React.PropTypes.number,
		_height: React.PropTypes.number,
		_width: React.PropTypes.number,
		// if xScale and/or yScale is passed as props
		// the user also needs to set 
		// xDomainUpdate=true and yDomainUpdate=true
		// in order for this component to update the scale on change of data
		xScale: React.PropTypes.func,
		yScale: React.PropTypes.func,
		xDomainUpdate: React.PropTypes.bool,
		yDomainUpdate: React.PropTypes.bool
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.Chart",
			transformDataAs: "none"
		};
	},
	getWidth() {
		return this.props.width || this.props._width;
	},
	getHeight() {
		return this.props.height || this.props._height;
	},
	componentWillMount() {
		this.updateScales(this.props);
	},
	componentWillReceiveProps(nextProps) {
		this.updateScales(nextProps);
	},
	updateScales(props) {
		var xScale = this.props.xScale,
			yScale = this.props.yScale;

		if (xScale === undefined) {
			xScale = polyLinearTimeScale();
		}
		if (yScale === undefined) {
			yScale = d3.scale.linear();;
		}
		var children = props.children
		if (!Array.isArray(children)) {
			children = [props.children];
		}
		var yAccessors = [], xAccessors = [];
		children.filter(function (eachChild) {
				var contains = ['ReStock.DataSeries', 'ReStock.ChartOverlay']
					.indexOf(eachChild.props.namespace) > -1;
				return contains;
			})
			.forEach(function(child) {
				// console.log(child);
				if (child.props) {
					yAccessors.push(child.props.yAccessor);
					xAccessors.push(child.props.xAccessor);
				}
			});
		var result = ScaleUtils.flattenData(props.data, xAccessors, yAccessors);
		if (this.props.xScale === undefined || this.props.xDomainUpdate) {
			xScale.range([0, this.props.width]);
			if (xScale.data !== undefined) {
				xScale.data(this.props.data);
			} else {
				xScale.domain(d3.extent(result.xValues));
			}
		}
		if (this.props.yScale === undefined || this.props.yDomainUpdate) {
			yScale.range([0, this.props.width]);

			var domain = d3.extent(result.yValues);
			var extraPadding = Math.abs(domain[0] - domain[1]) * 0.05;

			yScale.domain([domain[0] - extraPadding, domain[1] + extraPadding]);
		}
		console.log(xScale.range(), yScale.range());
		console.log(xScale.domain(), yScale.domain());
	},
	render() {
		return (
			<g>{this.props.children}</g>
		);
	}
});

module.exports = Chart;
