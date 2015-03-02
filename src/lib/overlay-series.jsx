'use strict';
var React = require('react'),
	PureRenderMixin = require('./mixin/restock-pure-render-mixin'),
	Utils = require('./utils/utils');

var OverlaySeries = React.createClass({
	//namespace: "ReStock.OverlaySeries",
	mixins: [PureRenderMixin],
	propTypes: {
		_xScale: React.PropTypes.func.isRequired,
		_yScale: React.PropTypes.func.isRequired,
		_xAccessor: React.PropTypes.func.isRequired,
		_yAccessor: React.PropTypes.func.isRequired,
		data: React.PropTypes.array.isRequired,
		type: React.PropTypes.oneOf(['sma', 'ema']),
		options: React.PropTypes.object.isRequired,
		id: React.PropTypes.number.isRequired
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.OverlaySeries"
		};
	},
	renderChildren() {
		return React.Children.map(this.props.children, (child) => {
			var newChild = child;

			if (typeof child.type === 'string') return newChild;

			if (/Series$/.test(newChild.props.namespace)) {
				newChild = React.addons.cloneWithProps(newChild, {
					_xScale: this.props._xScale,
					_yScale: this.props._yScale,
					_xAccessor: (this.props.xAccessor || this.props._xAccessor),
					_yAccessor: this.props.yAccessor,
					data: this.props.data
				});
			}
			else {
				newChild = React.addons.cloneWithProps(newChild, {
					_xScale: this.props._xScale,
					_yScale: this.props._yScale,
					_xAccessor: (this.props.xAccessor || this.props._xAccessor),
					_yAccessor: this.props.yAccessor,
					_currentItem: this.props._currentItem,
					_showCurrent: this.props._showCurrent
				});
			}

			return newChild;
		}, this);
	},
	render() {
		//throw new Error();
		return (
			<g></g>
		);
	}
});

module.exports = OverlaySeries;

//{this.renderChildren()}
