'use strict';
var React = require('react/addons');
// var TestUtils = React.addons.TestUtils;

var Chart = require('./chart');
var EventCapture = require('./event-capture');
var MouseCoordinates = require('./mouse-coordinates');
var EventCaptureMixin = require('../mixin/event-capture-mixin');

var ChartCanvas = React.createClass({
	mixins: [EventCaptureMixin],
	propTypes: {
		width: React.PropTypes.number.isRequired
		, height: React.PropTypes.number.isRequired
		, margin: React.PropTypes.object
	},
	getInitialState() {
		return {};
	},
	getDefaultProps() {
		return {
			margin: {top: 20, right: 30, bottom: 30, left: 80}
		};
	},
	renderChildren(height, width) {
		return React.Children.map(this.props.children, (child) => {
			if (typeof child.type === 'string') return child;
			var newChild = child;
			/*if (child.type === Chart.type || child.type === Translate.type) {
				newChild = React.addons.cloneWithProps(newChild, {
					_data: this.state.dataStore.get().data
				});
			}*/
			if (child.type === EventCapture.type) {
				newChild = React.addons.cloneWithProps(newChild, {
					_eventStore: this.state.eventStore
				});
			} else if (child.type === MouseCoordinates.type) {
				newChild = React.addons.cloneWithProps(newChild, {
					_show: this.state.eventStore.get().mouseOver.value,
					_mouseXY: this.state.eventStore.get().mouseXY,
					_currentItem: this.state.dataStore.get().currentItem
				});
			}
			return React.addons.cloneWithProps(newChild, {
				_width: width
				, _height: height
			});
		});
	},
	render() {
		var w = this.props.width - this.props.margin.left - this.props.margin.right;
		var h = this.props.height - this.props.margin.top - this.props.margin.bottom;
		var transform = 'translate(' + this.props.margin.left + ',' +  this.props.margin.top + ')';
		var clipPath = '<clipPath id="chart-area-clip">'
							+ '<rect x="0" y="0" width="' + w + '" height="' + h + '" />'
						+ '</clipPath>';

		var children = this.renderChildren(h, w);

		return (
			<svg width={this.props.width} height={this.props.height}>
				<defs dangerouslySetInnerHTML={{ __html: clipPath}}></defs>
				<g transform={transform}>{children}</g>
			</svg>
		);
	}
});

module.exports = ChartCanvas;
