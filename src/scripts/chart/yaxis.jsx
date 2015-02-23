'use strict';
var React = require('react')
	, d3 = require('d3');

var YAxis = React.createClass({
	propTypes: {
		axisAt: React.PropTypes.oneOfType([
					React.PropTypes.oneOf(['left', 'right', 'middle'])
					, React.PropTypes.number
				]),
		orient: React.PropTypes.oneOf(['left', 'right'])
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.YAxis",
			showGrid: false
		};
	},
	getInitialState() {
		return {};
	},
	componentWillMount() {
		this.state.yAxis = d3.svg.axis();
	},
	componentDidMount() {
		this.updateAxis();
	},
	componentDidUpdate() {
		this.updateAxis();
	},
	updateAxis() {
		this.state.yAxis
			.scale(this.props._yScale)
			.orient(this.props.orient)
			//.innerTickSize(this.props.showGrid ? this.props.innerTickSize : 5)
			//.outerTickSize(this.props.showGrid ? this.props.outerTickSize : 5)
			//.tickPadding(this.props.showGrid ? 5 : 10)
			;

		d3.select(this.getDOMNode()).call(this.state.yAxis);
	},
	render() {
		var axisAt = this.props.axisAt
			, range = this.props._xScale.range();
		if (this.props.axisAt === 'left') axisAt = Math.min(range[0], range[1]);
		if (this.props.axisAt === 'right') axisAt = Math.max(range[0], range[1]);
		if (this.props.axisAt === 'middle') axisAt = (range[0] + range[1]) / 2;

		return (
			<g className='y axis' transform={'translate(' + axisAt + ', 0)'}></g>
		);
	}
});

module.exports = YAxis;
