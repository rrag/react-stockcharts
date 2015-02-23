'use strict';
var React = require('react');
var d3 = require('d3');

var ScaleUtils = require('../utils/scale-utils');

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
		var xScale = this.props.xScale || this.props._xScale,
			yScale = this.props.yScale;

		if (xScale === undefined) {
			xScale = d3.time.scale();
			//xScale = polyLinearTimeScale();
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
					var xAccesor = child.props.xAccessor || props._indexAccessor
					yAccessors.push(child.props.yAccessor);
					xAccessors.push(xAccesor);
				}
			});
		var result = ScaleUtils.flattenData(props.data, xAccessors, yAccessors);

		xScale.range([0, this.getWidth()]);
		xScale.domain(d3.extent(result.xValues));

		if (this.props.xScale === undefined || this.props.xDomainUpdate) {
			if (xScale.data !== undefined) {
				xScale.data(this.props.data);
			} else {
				xScale.domain(d3.extent(result.xValues));
			}
		}

		if (this.props.yScale === undefined || this.props.yDomainUpdate) {
			yScale.range([this.getHeight(), 0]);

			var domain = d3.extent(result.yValues);
			//var extraPadding = Math.abs(domain[0] - domain[1]) * 0.05;
			//yScale.domain([domain[0] - extraPadding, domain[1] + extraPadding]);
			yScale.domain(domain);
		}

		children.filter(function (eachChild) {
				var contains = ['ReStock.DataSeries', 'ReStock.ChartOverlay', 'ReStock.XAxis', 'ReStock.YAxis']
					.indexOf(eachChild.props.namespace) > -1;
				return contains;
			})
			.forEach(function(child) {
				child.props._xScale = xScale;
				child.props._yScale = yScale;
				child.props.data = props.data;
				if (child.props.xAccessor === undefined)
					child.props.xAccessor = props._indexAccessor;
			});
	},
	render() {
		return (
			<g>{this.props.children}</g>
		);
	}
});

module.exports = Chart;
