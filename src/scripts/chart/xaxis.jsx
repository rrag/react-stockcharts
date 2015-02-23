'use strict';
var React = require('react')
	, d3 = require('d3');

var XAxis = React.createClass({
	propTypes: {
		axisAt: React.PropTypes.oneOfType([
					React.PropTypes.oneOf(['top', 'bottom', 'middle'])
					, React.PropTypes.number
				]),
		orient: React.PropTypes.oneOf(['top', 'bottom'])
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
		this.state.xAxis
			.scale(this.props._xScale)
			.orient(this.props.orient)
			//.innerTickSize(this.props.showGrid ? this.props.innerTickSize : 5)
			//.outerTickSize(this.props.showGrid ? this.props.outerTickSize : 5)
			//.tickPadding(this.props.showGrid ? 5 : 10)
			;

		d3.select(this.getDOMNode()).call(this.state.xAxis);
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
