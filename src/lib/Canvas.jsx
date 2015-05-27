'use strict';
var React = require('react');

var Canvas = React.createClass({
	propTypes: {
		width: React.PropTypes.number.isRequired,
		height: React.PropTypes.number.isRequired,
		left: React.PropTypes.number.isRequired,
		top: React.PropTypes.number.isRequired
	},
	componentDidMount() {
		console.log(this.getCanvas());
	},
	getCanvas() {
		return React.findDOMNode(this.refs.canvas);
	},
	render() {
		return (
			<canvas ref="canvas"
				width={this.props.width}
				height={this.props.height}
				style={{ position: 'absolute', left: this.props.left, top: this.props.top}}/>
		);
	}
});

module.exports = Canvas;
