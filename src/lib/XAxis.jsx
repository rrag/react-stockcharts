'use strict';
var React = require('react'),
	d3 = require('d3');

var XAxis = React.createClass({
	propTypes: {
		axisAt: React.PropTypes.oneOfType([
					React.PropTypes.oneOf(['top', 'bottom', 'middle'])
					, React.PropTypes.number
				]).isRequired,
		orient: React.PropTypes.oneOf(['top', 'bottom']).isRequired,
		innerTickSize: React.PropTypes.number,
		outerTickSize: React.PropTypes.number,
		tickFormat: React.PropTypes.func,
		tickPadding: React.PropTypes.number,
		tickSize: React.PropTypes.number,
		ticks: React.PropTypes.number,
		tickValues: React.PropTypes.array
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.XAxis",
			showGrid: false
		};
	},
	getInitialState() {
		return {};
	},
	componentWillMount() {
		this.state.xAxis = d3.svg.axis();
	},
	componentDidMount() {
		this.updateAxis();
	},
	componentDidUpdate() {
		this.updateAxis();
	},
	updateAxis() {
		var axis = d3.svg.axis()
			.scale(this.props._xScale)
			.orient(this.props.orient)
			//.innerTickSize(this.props.showGrid ? this.props.innerTickSize : 5)
			//.outerTickSize(this.props.showGrid ? this.props.outerTickSize : 5)
			//.tickPadding(this.props.showGrid ? 5 : 10)
			;
		if (this.props.orient) axis.orient(this.props.orient);
		if (this.props.innerTickSize) axis.innerTickSize(this.props.innerTickSize);
		if (this.props.outerTickSize) axis.outerTickSize(this.props.outerTickSize);
		if (this.props.tickFormat) {
			if (this.props._xScale.isPolyLinear && this.props._xScale.isPolyLinear())
				console.warn('Cannot set tickFormat on a poly linear scale, ignoring tickFormat on XAxis');
			else
				axis.tickFormat(this.props.tickFormat)
		};
		if (this.props.tickPadding) axis.tickPadding(this.props.tickPadding);
		if (this.props.tickSize) axis.tickSize(this.props.tickSize);
		if (this.props.ticks) axis.ticks(this.props.ticks);
		if (this.props.tickValues) axis.tickValues(this.props.tickValues);
		d3.select(this.getDOMNode()).call(axis);
	},
	render() {
		var axisAt = this.props.axisAt
			, range = this.props._yScale.range();
		if (this.props.axisAt === 'top') axisAt = Math.min(range[0], range[1]);
		if (this.props.axisAt === 'bottom') axisAt = Math.max(range[0], range[1]);
		if (this.props.axisAt === 'middle') axisAt = (range[0] + range[1]) / 2;

		return (
			<g className='x axis' transform={'translate(0, ' + axisAt + ')'}></g>
		);
	}
});

module.exports = XAxis;
