'use strict';
var React = require('react/addons');
var PureRenderMixin = React.addons.PureRenderMixin;

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
	mixins: [PureRenderMixin],
	getDefaultProps() {
		return {
			transformDataAs: "none",
			yDomainUpdate: true
		};
	},
	getWidth() {
		return this.props.width || this.props._width;
	},
	getHeight() {
		return this.props.height || this.props._height;
	},
/*	componentWillMount() {
		this.updateScales(this.props);
	},
	componentWillReceiveProps(nextProps) {
		this.updateScales(nextProps);
	},*/
	renderChildren(height, width) {
		return React.Children.map(this.props.children, (child) => {
			if (typeof child.type === 'string') return child;
			var newChild = child;
			/*if (child.type === Chart.type || child.type === Translate.type) {
				newChild = React.addons.cloneWithProps(newChild, {
					_data: this.state.dataStore.get().data
				});
			}*/
			if (child.type === EventCapture.type) {
				newChild = React.addons.cloneWithProps(newChild, {
					_eventStore: this.state.eventStore
				});
			}
			return React.addons.cloneWithProps(newChild, {
				_width: width
				, _height: height
			});
		});
	},
	updateScales(props) {
		console.log('updateScales');

		var xScale = this.props.xScale || this.props._xScale,
			yScale = this.props.yScale;

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
		var children = props.children
		if (!Array.isArray(children)) {
			children = [props.children];
		}
		var yAccessors = [], xAccessors = [];
		children.filter((eachChild) => {
				return ['ReStock.DataSeries', 'ReStock.ChartOverlay']
					.indexOf(eachChild.props.namespace) > -1
			})
			.forEach((child) => {
				if (child.props) {
					var xAccesor = child.props.xAccessor || props._indexAccessor
					yAccessors.push(child.props.yAccessor);
					xAccessors.push(xAccesor);
				}
			});
		var result = ScaleUtils.flattenData(props.data, xAccessors, yAccessors);

		if (this.props.xScale === undefined || this.props.xDomainUpdate) {
			xScale.range([0, this.getWidth()]);
			// if polylinear scale then set data
			if (xScale.data !== undefined) {
				xScale.data(this.props.data);
			} else {
				// else set the domain
				xScale.domain(d3.extent(result.xValues));
			}
		}

		if (this.props.yScale === undefined || this.props.yDomainUpdate) {
			yScale.range([this.getHeight(), 0]);
			var domain = d3.extent(result.yValues);
			//var extraPadding = Math.abs(domain[0] - domain[1]) * 0.05;
			//yScale.domain([domain[0] - extraPadding, domain[1] + extraPadding]);
			yScale.domain(domain);
			console.log(domain);
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
				if (child.props.xAccessor === undefined){
					child.props._xAccessor = props._indexAccessor;
				} else if (this.props._polyLinear) {
					console.warn('xAccessor defined in DataSeries will override the indexAccessor of the polylinear scale. This might not be the right configuration');
					console.warn('Either remove the xAccessor configuration on the DataSeries or change the polyLinear=false in Translate');
				}
			}.bind(this));
	},
	render() {
		console.log('render');
		console.log('render');
		console.log('render');
		console.log('render');
		console.log('render');
		console.log('render');
		console.log('render');
		console.log('render');
		console.log('render');
		console.log('render');
		console.log('render');
		console.log('render');
		console.log('render');
		console.log('render');
		console.log('render');
		console.log('render');
		this.updateScales(this.props);
		return (
			<g>{this.props.children}</g>
		);
	}
});

module.exports = Chart;
