'use strict';
var React = require('react/addons');
// var TestUtils = React.addons.TestUtils;

var Canvas = React.createClass({
	displayName: "Canvas",

	propTypes: {
		width: React.PropTypes.number.isRequired
		, height: React.PropTypes.number.isRequired
		, margin: React.PropTypes.object
	},
	getDefaultProps() {
		return {
			margin: {top: 20, right: 20, bottom: 30, left: 80}
		};
	},
	handleClick() {
		this.setState({a: 1});
	},
	render() {
		var w = this.props.width - this.props.margin.left - this.props.margin.right;
		var h = this.props.height - this.props.margin.top - this.props.margin.bottom;
		var transform = 'translate(' + this.props.margin.left + ',' +  this.props.margin.top + ')';
		var clipPath = '<clipPath id="chart-area-clip">'
							+ '<rect x="0" y="0" width="' + w + '" height="' + h + '" />'
						+ '</clipPath>';
		var children = this.props.children;
		if (!Array.isArray(this.props.children)) {
			children = [this.props.children];
		}
		children.forEach(function (d) {
			//console.log(Dummy.namespace());

			// d.type === function for React elements
			// d.type === string for native html or svg elements
			if (typeof d.type === "function") {
				d.props._width = w;
				d.props._height = h;
			}
			// d has children
			// do I set width and height to all of those?
			if (d.props.children !== undefined) {
			}
		});
		return (
			<svg
				onClick={this.handleClick} 
				width={this.props.width} height={this.props.height}>
				<defs dangerouslySetInnerHTML={{ __html: clipPath}}></defs>
				<g transform={transform}>{this.props.children}</g>
			</svg>
		);
	}
});

module.exports = Canvas;
