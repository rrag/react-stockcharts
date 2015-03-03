'use strict';

// DataSeries has to hold OverlaySeries since DataSeries might define the xAccessor and it needs to be sent to OverlaySeries
var React = require('react'),
	PureRenderMixin = require('./mixin/restock-pure-render-mixin'),
	Utils = require('./utils/utils');

var DataSeries = React.createClass({
	//namespace: "ReStock.DataSeries",
	mixins: [PureRenderMixin],
	propTypes: {
		xAccessor: React.PropTypes.func,
		_xAccessor: React.PropTypes.func,
		yAccessor: React.PropTypes.func.isRequired
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.DataSeries"
		};
	},
	componentWillReceiveProps(nextProps) {
		if (nextProps._mouseXY !== this.props._mouseXY) {
			//console.log('here......', nextProps._mouseXY);

			var xAccessor = nextProps.xAccessor || nextProps._xAccessor;
			var yAccessor = nextProps.yAccessor;

			if (nextProps._currentItem) {
				var xValue = nextProps._xScale.invert(nextProps._mouseXY[0]);
				var yValue = nextProps._yScale.invert(nextProps._mouseXY[1]);
				var item = Utils.getClosestItem(nextProps.data, xValue, xAccessor);
				item = nextProps._currentItem.set(item);
				nextProps._currentValue.xy.set([Math.round(nextProps._xScale(xAccessor(item))), nextProps._mouseXY[1]]);
				nextProps._currentValue.values.set([xAccessor(item), yValue]);
			}
			if (nextProps._lastItem) {
				nextProps._lastItem.set(nextProps.data[nextProps.data.length - 1]);
			}
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
				if (/OverlaySeries$/.test(newChild.props.namespace)) {
					var key = 'overlay' + newChild.props.id;
					var overlay = this.props._overlays[key];
					if (overlay === undefined) {
						overlay = this.props._overlays.set(key, {})[key];
					}

					newChild = React.addons.cloneWithProps(newChild, {
						_overlay: overlay,
					});
				}
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
			<g>{this.renderChildren()}</g>
		);
	}
});

module.exports = DataSeries;
