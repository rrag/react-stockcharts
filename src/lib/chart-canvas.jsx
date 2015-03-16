'use strict';
var React = require('react/addons');
// var TestUtils = React.addons.TestUtils;

var Chart = require('./chart');
var EventCaptureMixin = require('./mixin/event-capture-mixin');
var ChartContainerMixin = require('./mixin/chart-container-mixin');

var ChartCanvas = React.createClass({
	mixins: [ChartContainerMixin, EventCaptureMixin],
	propTypes: {
		width: React.PropTypes.number.isRequired
		, height: React.PropTypes.number.isRequired
		, margin: React.PropTypes.object
	},
	getAvailableHeight() {
		return this.props.height - this.props.margin.top - this.props.margin.bottom;
	},
	getAvailableWidth() {
		return this.props.width - this.props.margin.left - this.props.margin.right;
	},
	getInitialState() {
		return {};
	},
	getDefaultProps() {
		return {
			margin: {top: 20, right: 30, bottom: 30, left: 80}
		};
	},
	renderChildren() {

		var children = React.Children.map(this.props.children, (child) => {
			if (typeof child.type === 'string') return child;
			var newChild = child;
			return React.addons.cloneWithProps(newChild, {
				_width: this.getAvailableWidth()
				, _height: this.getAvailableHeight()
			});
		});
		return this._renderChildren(children);
	},
	render() {

		var transform = 'translate(' + this.props.margin.left + ',' +  this.props.margin.top + ')';
		var clipPath = '<clipPath id="chart-area-clip">'
							+ '<rect x="0" y="0" width="' + this.getAvailableWidth() + '" height="' + this.getAvailableHeight() + '" />'
						+ '</clipPath>';

		var children = this.renderChildren();

		return (
			<svg width={this.props.width} height={this.props.height}>
				<defs dangerouslySetInnerHTML={{ __html: clipPath}}></defs>
				<g transform={transform}>{children}</g>
			</svg>
		);
	}
});

module.exports = ChartCanvas;
