'use strict';
var React = require('react');

var Dummy = React.createClass({
	childContextTypes: {
		data: React.PropTypes.object,
		dataTransformOptions: React.PropTypes.object,
		plotData: React.PropTypes.array,
		chartData: React.PropTypes.array,
		currentItems: React.PropTypes.array,
		show: React.PropTypes.bool,
		mouseXY: React.PropTypes.array,
		interval: React.PropTypes.string,

		// EventCaptureMixin
		onMouseMove: React.PropTypes.func,
		onMouseEnter: React.PropTypes.func,
		onMouseLeave: React.PropTypes.func,
		onZoom: React.PropTypes.func,
		onPanStart: React.PropTypes.func,
		onPan: React.PropTypes.func,
		onPanEnd: React.PropTypes.func,
		panInProgress: React.PropTypes.bool.isRequired,
		focus: React.PropTypes.bool.isRequired,
		onFocus: React.PropTypes.func,
	},
	getChildContext() {
		console.log('kjahfdshfkdashfpodisfhoadsiufhadslfhsdiufhds777777777777');
		return this.props.contextProps;
	},
	render() {
		console.log('Dummy.render()');
		return this.props.render();
	}
});

module.exports = Dummy;

