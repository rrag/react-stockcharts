'use strict';
var React = require('react');

class Canvas extends React.Component {
	constructor(props) {
		super(props);
	}/*,
	componentDidMount() {
		console.log(this.getCanvas());
	},
	getCanvas() {
		return React.findDOMNode(this.refs.canvas);
	},*/
	render() {
		return (
			<canvas ref="canvas"
				width={this.props.width}
				height={this.props.height}
				style={{ position: 'absolute', left: this.props.left, top: this.props.top}}/>
		);
	}
};

Canvas.contextTypes = {
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
	left: React.PropTypes.number.isRequired,
	top: React.PropTypes.number.isRequired
}

module.exports = Canvas;
