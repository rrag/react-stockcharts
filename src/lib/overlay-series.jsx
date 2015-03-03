'use strict';

var React = require('react'),
	PureRenderMixin = require('./mixin/restock-pure-render-mixin'),
	Utils = require('./utils/utils'),
	OverlayUtils = require('./utils/overlay-utils'),
	d3 = require('d3'),
	overlayColors = d3.scale.category10();

var OverlaySeries = React.createClass({
	//namespace: "ReStock.OverlaySeries",
	mixins: [PureRenderMixin],
	propTypes: {
		_xScale: React.PropTypes.func.isRequired,
		_yScale: React.PropTypes.func.isRequired,
		_xAccessor: React.PropTypes.func.isRequired,
		_yAccessor: React.PropTypes.func.isRequired,
		_overlay: React.PropTypes.object.isRequired,
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
	componentWillMount() {
		// register self
		//console.log(this.props._overlay);
		var overlay = {
			id: this.props.id,
			color: this.props.color || overlayColors(this.props.id),
			yAccessor: OverlayUtils.getYAccessor(this.props),
			options: this.props.options,
			type: this.props.type,
			tooltipLabel: OverlayUtils.getToolTipLabel(this.props)
		};
		this.props._overlay.set(overlay);
	},
	componentWillUnMount() {
		// unregister self
		this.props._overlay.set(null);
	},
	componentWillReceiveProps(nextProps) {
		// if things change reset the overlay TODO

		// if optinos have changed - update the options
		if (this.props.options !== nextProps.options) {
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
