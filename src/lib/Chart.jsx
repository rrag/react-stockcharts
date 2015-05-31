'use strict';

var React = require('react'),
	PureRenderMixin = require('lib/utils/MyPureRenderMixin');

var Chart = React.createClass({
	statics: {
		getWidth(props) { return props.width || props._width; },
		getHeight(props) { return props.height || props._height; }
	},
	propTypes: {
		height: React.PropTypes.number,
		width: React.PropTypes.number,
		origin: React.PropTypes.oneOfType([
					React.PropTypes.array
					, React.PropTypes.func
				]).isRequired,
		id: React.PropTypes.number.isRequired,
		xScale: React.PropTypes.func,
		yScale: React.PropTypes.func,
		xDomainUpdate: React.PropTypes.bool,
		yDomainUpdate: React.PropTypes.bool,
	},
	mixins: [PureRenderMixin],
	contextTypes: {
		_width: React.PropTypes.number.isRequired,
		_height: React.PropTypes.number.isRequired,
		_data: React.PropTypes.array.isRequired,
		_chartData: React.PropTypes.array,
		_updateMode: React.PropTypes.object
	},
	childContextTypes: {
		xScale: React.PropTypes.func.isRequired,
		yScale: React.PropTypes.func.isRequired,
		xAccessor: React.PropTypes.func.isRequired,
		yAccessor: React.PropTypes.func.isRequired,
		overlays: React.PropTypes.array.isRequired,
	},
	getChildContext() {
		var chartData = this.context._chartData.filter((each) => each.id === this.props.id)[0];
		// console.log(chartData);
		return {
			xScale: chartData.plot.scales.xScale,
			yScale: chartData.plot.scales.yScale,
			xAccessor: chartData.config.accessors.xAccessor,
			yAccessor: chartData.config.accessors.yAccessor,
			overlays: chartData.config.overlays
		}
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.Chart",
			transformDataAs: "none",
			yDomainUpdate: true,
			origin: [0, 0]
		};
	},
	render() {
		// console.log('Chart.render()');

		var origin = typeof this.props.origin === 'function'
			? this.props.origin(this.context._width, this.context._height)
			: this.props.origin;

		var children = React.Children.map(this.props.children, (child) => React.cloneElement(child));

		return <g transform={`translate(${origin[0]}, ${origin[1]})`}>{children}</g>;
	}
});

module.exports = Chart;
