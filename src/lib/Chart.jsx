'use strict';

var React = require('react'),
	PureComponent = require('lib/utils/PureComponent');

var Utils = require('./utils/utils');

class Chart extends PureComponent {
	getChildContext() {
		var chartData = this.context.chartData.filter((each) => each.id === this.props.id)[0];
		return {
			xScale: chartData.plot.scales.xScale,
			yScale: chartData.plot.scales.yScale,
			xAccessor: chartData.config.accessors.xAccessor,
			yAccessor: chartData.config.accessors.yAccessor,
			overlays: chartData.config.overlays,
			compareSeries: chartData.config.compareSeries,
			isCompareSeries: chartData.config.compareSeries.length > 0
		}
	}
	render() {
		var origin = typeof this.props.origin === 'function'
			? this.props.origin(this.context.width, this.context.height)
			: this.props.origin;
		var children = React.Children.map(this.props.children, (child) => {
			var newChild = Utils.isReactVersion13()
				? React.withContext(this.getChildContext(), () => {
					return React.createElement(child.type, Utils.mergeObject({ key: child.key, ref: child.ref}, child.props));
				})
				: React.cloneElement(child);
			return newChild;
		});
		return <g transform={`translate(${origin[0]}, ${origin[1]})`}>{children}</g>;
	}
};

Chart.propTypes = {
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
	yMousePointerDisplayLocation: React.PropTypes.oneOf(['left', 'right']),
	yMousePointerDisplayFormat: React.PropTypes.func,
};
Chart.defaultProps = {
	namespace: "ReStock.Chart",
	transformDataAs: "none",
	yDomainUpdate: true,
	origin: [0, 0]
};
Chart.contextTypes = {
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
	chartData: React.PropTypes.array,
};
Chart.childContextTypes = {
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	yAccessor: React.PropTypes.func.isRequired,
	overlays: React.PropTypes.array.isRequired,
	isCompareSeries: React.PropTypes.bool.isRequired,
	compareSeries: React.PropTypes.array.isRequired,
};
module.exports = Chart;
