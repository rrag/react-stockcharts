'use strict';

var React = require('react'),
	PureRenderMixin = require('./mixin/restock-pure-render-mixin'),
	Utils = require('./utils/utils'),
	OverlayUtils = require('./utils/overlay-utils');

var OverlaySeries = React.createClass({
	//namespace: "ReStock.OverlaySeries",
	mixins: [PureRenderMixin],
	/*shouldComponentUpdate(nextProps, nextState) {
		return false;
	},*/
	propTypes: {
		_xScale: React.PropTypes.func.isRequired,
		_yScale: React.PropTypes.func.isRequired,
		_xAccessor: React.PropTypes.func.isRequired,
		_yAccessor: React.PropTypes.func.isRequired,
		_overlay: React.PropTypes.object.isRequired,
		data: React.PropTypes.array.isRequired,
		type: React.PropTypes.oneOf(['sma', 'ema']),
		options: React.PropTypes.object.isRequired,
		id: React.PropTypes.number.isRequired,
		stroke: React.PropTypes.string
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.OverlaySeries"
		};
	},/*
	componentWillMount: function () {
		var overlay = {
			id: newChild.props.id,
			yAccessor: OverlayUtils.getYAccessor(newChild.props),
			options: newChild.props.options,
			type: newChild.props.type,
			tooltipLabel: OverlayUtils.getToolTipLabel(newChild.props),
			stroke: newChild.stroke || overlayColors(newChild.props.id)
		};
	},*/
	componentWillUnMount() {
		console.log('componentWillUnMount');
		console.log('componentWillUnMount');
		console.log('componentWillUnMount');
		console.log('componentWillUnMount');
		console.log('componentWillUnMount');
		// unregister self
		this.props._overlay.set(null);
	},
	componentWillReceiveProps(nextProps) {
		// if things change reset the overlay TODO

		// if optinos have changed - update the options
		if (this.props.options !== nextProps.options) {
			console.log('updating props.....');
			// var overlay = this.props._overlays[key];
			this.props._overlay.set('options', nextProps.options);
		}
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
					_yAccessor: this.props._overlay.yAccessor,
					data: this.props.data,
					stroke: this.props._overlay.stroke,
					className: "overlay"
				});
			}
			return newChild;
		}, this);
	},
	render() {
		console.log('OverlaySeries.render');
		if (this.props._overlay.yAccessor === undefined) return null;
		return (
			<g>{this.renderChildren()}</g>
		);
	}
});

module.exports = OverlaySeries;

//
