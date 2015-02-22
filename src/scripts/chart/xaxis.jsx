'use strict';
var React = require('react')
	, d3 = require('d3');

var XAxis = React.createClass({
	getDefaultProps() {
		return {showGrid: false};
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
			.scale(this.props.xScale)
			.orient(this.props.orient)
			.innerTickSize(this.props.showGrid ? this.props.innerTickSize : 5)
			.outerTickSize(this.props.showGrid ? this.props.outerTickSize : 5)
			.tickPadding(this.props.showGrid ? 5 : 10);

		d3.select(this.getDOMNode()).call(this.state.xAxis);
	},
	render() {
		return (
			<g className={(this.props.showGrid ? 'grid ' : '') + 'x axis'} transform={'translate(0, ' + this.props.axisAt + ')'}></g>
		);
	}
});

module.exports = XAxis;
