'use strict';
var React = require('react/addons');
var shallowEqual = require("react/lib/shallowEqual");

var d3 = require('d3');

var ScaleUtils = require('../utils/scale-utils');

var Chart = React.createClass({
	statics: {
		getWidth(props) { return props.width || props._width; },
		getHeight(props) { return props.height || props._height; }
	},
	propTypes: {
		data: React.PropTypes.array.isRequired,
		height: React.PropTypes.number,
		width: React.PropTypes.number,
		_height: React.PropTypes.number,
		_width: React.PropTypes.number,
		// if xScale and/or yScale is passed as props
		// the user needs to set 
		// xDomainUpdate=false and yDomainUpdate=false
		// in order for this component to NOT update the scale on change of data
		xScale: React.PropTypes.func,
		yScale: React.PropTypes.func,
		xDomainUpdate: React.PropTypes.bool,
		yDomainUpdate: React.PropTypes.bool
	},
	//mixins: [PureRenderMixin],
	getDefaultProps() {
		return {
			transformDataAs: "none",
			yDomainUpdate: true
		};
	},
	componentWillMount() {
		var scales = this.defineScales(this.props);
		var xyAccessors = this.getXYAccessors(this.props);
		this.setState(this.updateScales(this.props,
			xyAccessors.xAccessors,
			xyAccessors.yAccessors,
			scales.xScale,
			scales.yScale));
	},
	componentWillReceiveProps(nextProps) {
		if (! shallowEqual(nextProps, this.props)) {
			var scales = this.defineScales(nextProps, this.state.xScale, this.state.yScale);
			var xyAccessors = this.getXYAccessors(nextProps);
			this.setState(this.updateScales(nextProps
				, xyAccessors.xAccessors
				, xyAccessors.yAccessors
				, scales.xScale
				, scales.yScale));
		};
	},
	defineScales(props, xScaleFromState, yScaleFromState) {
		var xScale = props.xScale || xScaleFromState || props._xScale,
			yScale = props.yScale || yScaleFromState;

		if (xScale === undefined) {
			var each = props.data[0];
			if (typeof each === 'object') {
				Object.keys(each).forEach((key) => {
					if (Object.prototype.toString.call(each[key]) === '[object Date]') {
						xScale = d3.time.scale();
					}
				});
			}
			if (xScale === undefined) xScale = d3.scale.linear();
			//xScale = polyLinearTimeScale();
		}
		if (yScale === undefined) {
			yScale = d3.scale.linear();;
		}
		return { xScale: xScale, yScale: yScale };
	},
	getXYAccessors(props) {
		var yAccessors = [], xAccessors = [];

		React.Children.forEach(props.children, (child) => {
			if (['ReStock.DataSeries', 'ReStock.ChartOverlay']
					.indexOf(child.props.namespace) > -1) {
				if (child.props) {
					var xAccesor = child.props.xAccessor || props._indexAccessor
					yAccessors.push(child.props.yAccessor);
					xAccessors.push(xAccesor);
				}
			}
		})
		return { xAccessors: xAccessors, yAccessors: yAccessors };
	},
	updateScales(props, xAccessors, yAccessors, xScale, yScale) {
		console.log('updateScales');

		var result = ScaleUtils.flattenData(props.data, xAccessors, yAccessors);

		if (props.xScale === undefined || props.xDomainUpdate) {
			xScale.range([0, Chart.getWidth(props)]);
			// if polylinear scale then set data
			if (xScale.data !== undefined) {
				xScale.data(props.data);
			} else {
				// else set the domain
				xScale.domain(d3.extent(result.xValues));
			}
		}

		if (props.yScale === undefined || props.yDomainUpdate) {
			yScale.range([Chart.getHeight(props), 0]);
			var domain = d3.extent(result.yValues);
			//var extraPadding = Math.abs(domain[0] - domain[1]) * 0.05;
			//yScale.domain([domain[0] - extraPadding, domain[1] + extraPadding]);
			yScale.domain(domain);
		}
		return {
			xScale: xScale.copy(),
			yScale: yScale.copy()
		};
	},
	renderChildren() {
		return React.Children.map(this.props.children, (child) => {
			if (typeof child.type === 'string') return child;
			if (['ReStock.DataSeries', 'ReStock.ChartOverlay', 'ReStock.XAxis', 'ReStock.YAxis']
				.indexOf(child.props.namespace) < 0) return child;

			var newChild = child;
			newChild = React.addons.cloneWithProps(newChild, {
				_xScale: this.state.xScale,
				_yScale: this.state.yScale,
				data: this.props.data,
				_xAccessor: this.props._indexAccessor
			});
			if (newChild.props.xAccessor !== undefined && this.props._polyLinear) {
				console.warn('xAccessor defined in DataSeries will override the indexAccessor of the polylinear scale. This might not be the right configuration');
				console.warn('Either remove the xAccessor configuration on the DataSeries or change the polyLinear=false in Translate');
			}
			return newChild;
		}, this);
	},
	render() {
		return (
			<g>{this.renderChildren()}</g>
		);
	}
});

module.exports = Chart;
