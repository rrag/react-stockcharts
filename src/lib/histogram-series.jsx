'use strict';
var React = require('react'),
	d3 = require('d3'),
	PureRenderMixin = require('./mixin/restock-pure-render-mixin');


var HistogramSeries = React.createClass({
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
	getDefaultProps() {
		return {
			namespace: "ReStock.HistogramSeries",
			baseAt: 'bottom',
			direction: 'up',
			className: 'bar'
		}
	},
	getBars() {
		var base = this.props.baseAt === 'top'
					? 0
					: this.props.baseAt === 'bottom'
						? this.props._yScale.range()[0]
						: this.props.baseAt === 'middle'
							? (this.props._yScale.range()[0] + this.props._yScale.range()[1]) / 2
							: this.props.baseAt;

		var dir = this.props.direction === 'up' ? -1 : 1;

		var getClassName = () => this.props.className;
		if (typeof this.props.className === 'function') {
			getClassName = this.props.className;
		}
		var width = Math.abs(this.props._xScale.range()[0] - this.props._xScale.range()[1]);
		var barWidth = width / (this.props.data.length);
		var bars = this.props.data
				.filter((d) => (this.props._yAccessor(d) !== undefined) )
				.map((d, idx) => {
					var yValue = this.props._yAccessor(d);
					var x = this.props._xScale(this.props._xAccessor(d)) - 0.5 * barWidth,
						className = getClassName(d) ,
						y, height;
					if (dir > 0) {
						y = base;
						height = this.props._yScale.range()[0] - this.props._yScale(yValue);
					} else {
						y = this.props._yScale(yValue);
						height = base - y;
					}

					return <rect key={idx} className={className}
								x={Math.floor(x)}
								y={Math.round(y)}
								width={Math.floor(barWidth)}
								height={Math.round(height)} />
				}, this);
		return bars;
	},
	render() {
		return (
			<g className="histogram">
				{this.getBars()}
			</g>
		);
	}
});

module.exports = HistogramSeries;

/*				

*/