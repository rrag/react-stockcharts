'use strict';
var React = require('react');
var d3 = require('d3');

var YAxis = React.createClass({
	getInitialState() {
		return {};
	},
	componentWillMount () {
		this.state.yAxis = d3.svg.axis();
	},
	componentDidMount() {
		this.updateAxis();
	},
	componentDidUpdate() {
		this.updateAxis();
	},
	updateAxis() {
		this.props.height = Math.max(this.props.yScale.range()[0], this.props.yScale.range()[1]);
		this.state.yAxis
			.scale(this.props.yScale)
			.orient(this.props.orient)
			.ticks(Math.ceil(this.props.height * 0.02))
			.innerTickSize(this.props.showGrid ? this.props.innerTickSize : 5)
			.outerTickSize(this.props.showGrid ? this.props.outerTickSize : 5)
			.tickPadding(this.props.showGrid ? 5 : 10);

		d3.select(this.getDOMNode()).call(this.state.yAxis);
	},
	handleDrag() {
		// console.log('drag...');
	},
	render() {
		return (
			<g className={(this.props.showGrid ? 'grid ' : '') + 'y axis'} transform={'translate(' + this.props.axisAt + ', 0)'}>
				<rect x='0' y='0' width='50' height={this.props.height} style={{opacity: 0}} onDrag={this.handleDrag} />
			</g>
		);
	}
});

module.exports = YAxis;
