'use strict';

var React = require('react');

var OverlaySeries = React.createClass({
	propTypes: {
		type: React.PropTypes.oneOf(['sma', 'ema']),
		options: React.PropTypes.object.isRequired,
		id: React.PropTypes.number.isRequired,
		stroke: React.PropTypes.string
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.OverlaySeries"
		};
	},
	contextTypes: {
		overlays: React.PropTypes.array.isRequired,
	},
	childContextTypes: {
		yAccessor: React.PropTypes.func.isRequired,
	},
	getChildContext() {
		var overlay = this.context.overlays.filter((each) => each.id === this.props.id)[0];
		return {
			yAccessor: overlay.yAccessor
		};
	},
	render() {
		return (
			<g>{this.props.children}</g>
		);
	}
});

module.exports = OverlaySeries;

//
