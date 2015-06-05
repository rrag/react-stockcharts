'use strict';
var React = require('react')
	, d3 = require('d3');

class YAxis extends React.Component {
	constructor(props) {
		super(props);
		this.updateAxis = this.updateAxis.bind(this);
	}
	componentDidMount() {
		this.updateAxis();
	}
	componentDidUpdate() {
		this.updateAxis();
	}
	updateAxis() {
		var scale = this.context.yScale;
		if (this.props.percentScale) scale = scale.copy().domain([0, 1]);

		var axis = d3.svg.axis()
			.scale(scale)
			.orient(this.props.orient);

		if (this.props.orient) axis.orient(this.props.orient);
		if (this.props.innerTickSize) axis.innerTickSize(this.props.innerTickSize);
		if (this.props.outerTickSize) axis.outerTickSize(this.props.outerTickSize);
		if (this.props.tickFormat) axis.tickFormat(this.props.tickFormat);
		if (this.props.tickPadding) axis.tickPadding(this.props.tickPadding);
		if (this.props.tickSize) axis.tickSize(this.props.tickSize);
		if (this.props.ticks) axis.ticks(this.props.ticks);
		if (this.props.tickValues) axis.tickValues(this.props.tickValues);
		
		d3.select(React.findDOMNode(this)).call(axis);
	}
	render() {
		var axisAt = this.props.axisAt
			, range = this.context.xScale.range();
		if (this.props.axisAt === 'left') axisAt = Math.min(range[0], range[1]) + this.props.axisPadding;
		if (this.props.axisAt === 'right') axisAt = Math.max(range[0], range[1]) + this.props.axisPadding;
		if (this.props.axisAt === 'middle') axisAt = (range[0] + range[1]) / 2 + this.props.axisPadding;

		return (
			<g className='y axis' transform={'translate(' + axisAt + ', 0)'}></g>
		);
	}
};

YAxis.propTypes = {
	axisAt: React.PropTypes.oneOfType([
				React.PropTypes.oneOf(['left', 'right', 'middle'])
				, React.PropTypes.number
			]).isRequired,
	orient: React.PropTypes.oneOf(['left', 'right']).isRequired,
	innerTickSize: React.PropTypes.number,
	outerTickSize: React.PropTypes.number,
	tickFormat: React.PropTypes.func,
	tickPadding: React.PropTypes.number,
	tickSize: React.PropTypes.number,
	ticks: React.PropTypes.number,
	tickValues: React.PropTypes.array,
	percentScale: React.PropTypes.bool,
	axisPadding: React.PropTypes.number
};
YAxis.defaultProps = {
	namespace: "ReStock.YAxis",
	showGrid: false,
	axisPadding: 0
};
YAxis.contextTypes = {
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired
};

module.exports = YAxis;
