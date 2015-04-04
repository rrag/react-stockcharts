'use strict';
var React = require('react'),
	d3 = require('d3'),
	PureRenderMixin = require('./mixin/restock-pure-render-mixin');


var HistogramSeries = React.createClass({displayName: "HistogramSeries",
	mixins: [PureRenderMixin],
	propTypes: {
		_xScale: React.PropTypes.func.isRequired,
		_yScale: React.PropTypes.func.isRequired,
		_xAccessor: React.PropTypes.func.isRequired,
		_yAccessor: React.PropTypes.func.isRequired,
		baseAt: React.PropTypes.oneOfType([
					React.PropTypes.oneOf(['top', 'bottom', 'middle'])
					, React.PropTypes.number
				]).isRequired,
		direction: React.PropTypes.oneOf(['up', 'down']).isRequired,
		className: React.PropTypes.oneOfType([
					React.PropTypes.func, React.PropTypes.string
				]).isRequired,
	},
	getDefaultProps:function() {
		return {
			namespace: "ReStock.HistogramSeries",
			baseAt: 'bottom',
			direction: 'up',
			className: 'bar'
		}
	},
	getBars:function() {
		var base = this.props.baseAt === 'top'
					? 0
					: this.props.baseAt === 'bottom'
						? this.props._yScale.range()[0]
						: this.props.baseAt === 'middle'
							? (this.props._yScale.range()[0] + this.props._yScale.range()[1]) / 2
							: this.props.baseAt;

		var dir = this.props.direction === 'up' ? -1 : 1;

		var getClassName = function()  {return this.props.className;}.bind(this);
		if (typeof this.props.className === 'function') {
			getClassName = this.props.className;
		}
		var width = Math.abs(this.props._xScale.range()[0] - this.props._xScale.range()[1]);
		var barWidth = width / (this.props.data.length) * 0.5;
		var bars = this.props.data
				.filter(function(d)  {return this.props._yAccessor(d) !== undefined;}.bind(this) )
				.map(function(d, idx)  {
					var yValue = this.props._yAccessor(d);
					var x = Math.round(this.props._xScale(this.props._xAccessor(d))) - 0.5 * barWidth,
						className = getClassName(d) ,
						y, height;
					if (dir > 0) {
						y = base;
						height = this.props._yScale.range()[0] - this.props._yScale(yValue);
					} else {
						y = this.props._yScale(yValue);
						height = base - y;
					}

					if (Math.round(barWidth) <= 1) {
						return React.createElement("line", {key: idx, className: className, 
									x1: Math.round(x), y1: Math.round(y), 
									x2: Math.round(x), y2: Math.round(y + height)})
					}
					return React.createElement("rect", {key: idx, className: className, 
								x: Math.round(x), 
								y: Math.round(y), 
								width: Math.round(barWidth), 
								height: Math.round(height)})
				}.bind(this), this);
		return bars;
	},
	render:function() {
		return (
			React.createElement("g", {className: "histogram"}, 
				this.getBars()
			)
		);
	}
});

module.exports = HistogramSeries;

/*				

*/