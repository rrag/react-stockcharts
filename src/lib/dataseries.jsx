'use strict';

// DataSeries has to hold OverlaySeries since DataSeries might define the xAccessor and it needs to be sent to OverlaySeries
// Data series has to pass the current mouse position to the children so this has no benefit
//     of PureRenderMixin

var React = require('react'),
	PureRenderMixin = require('./mixin/restock-pure-render-mixin'),
	Utils = require('./utils/utils'),
	d3 = require('d3'),
	OverlayUtils = require('./utils/overlay-utils'),
	overlayColors = Utils.overlayColors;

function getOverlayFromList(overlays, id) {
	return overlays.map((each) => [each.id, each])
		.filter((eachMap) => eachMap[0] === id)
		.map((eachMap) => eachMap[1])[0];
}

var DataSeries = React.createClass({
	//namespace: "ReStock.DataSeries",
	mixins: [PureRenderMixin],
	propTypes: {
		xAccessor: React.PropTypes.func,
		_xAccessor: React.PropTypes.func,
		yAccessor: React.PropTypes.func.isRequired,
		_currentMouseXY: React.PropTypes.array,
		_currentXYValue: React.PropTypes.array,
		_currentItem: React.PropTypes.object,
		_lastItem: React.PropTypes.object,
		_firstItem: React.PropTypes.object
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.DataSeries"
		};
	},
	componentWillReceiveProps(nextProps) {
		// TODO
		// if overlays are different, recalculate the data for the overlay that changed
		if (nextProps._mouseXY !== this.props._mouseXY) {

			var xAccessor = nextProps.xAccessor || nextProps._xAccessor;
			var yAccessor = nextProps.yAccessor;

			if (nextProps._currentItem) {

				var xValue = nextProps._xScale.invert(nextProps._mouseXY[0]);
				var yValue = nextProps._yScale.invert(nextProps._mouseXY[1]);

				var item = Utils.getClosestItem(nextProps.data, xValue, xAccessor);
				var keysToKeep = Object.keys(item);
				item = nextProps._currentItem.reset(item); 

				var a = nextProps._currentMouseXY.set([Math.round(nextProps._xScale(xAccessor(item))), nextProps._mouseXY[1]]);
				var b = nextProps._currentXYValue.set([xAccessor(item), yValue]);
			}
		}
		if (false /* do this only when the first or last is different, FIXME later */) {
			if (nextProps._lastItem) {
				var lastItem = Utils.cloneMe(nextProps.data[nextProps.data.length - 1]);
				lastItem = nextProps._lastItem.set(lastItem);
				// console.log(lastItem);
			}
			if (nextProps._firstItem) {
				var first = Utils.cloneMe(nextProps.data[0]);
				nextProps._firstItem.set(first);
			}
		}
	},
	componentWillMount() {
		var last = Utils.cloneMe(this.props.data[this.props.data.length - 1]);
		last = this.props._lastItem.set(last);

		var first = Utils.cloneMe(this.props.data[0]);
		first = this.props._firstItem.set(first);
	},
	renderChildren() {
		var overlaysToAdd = [];
		var newChildren = React.Children.map(this.props.children, (child) => {
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
					var key = newChild.props.id;
					var overlay = getOverlayFromList(this.props._overlays, newChild.props.id);
					var yAccessor = OverlayUtils.getYAccessor(newChild.props);
					if (overlay === undefined) {
						overlay = {
							id: newChild.props.id,
							yAccessor: yAccessor,
							options: newChild.props.options,
							type: newChild.props.type,
							tooltipLabel: OverlayUtils.getToolTipLabel(newChild.props),
							stroke: newChild.stroke || overlayColors(newChild.props.id)
						};
						// this.props._overlays.set(key, overlay);
						overlaysToAdd.push(overlay);
					} else {
						newChild = React.addons.cloneWithProps(newChild, {
							_overlay: overlay
						});
					}
				}
			} else {
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

		// console.log(overlaysToAdd);

		if (overlaysToAdd.length > 0) {
			var overlays = this.props._overlays.append(overlaysToAdd);
			var keys = Object.keys(newChildren);

			for (var i = 0; i < keys.length; i++) {
				var newChild = newChildren[keys[i]];
				if (newChild.props
						&& newChild.props._overlay === undefined
						&& /OverlaySeries$/.test(newChild.props.namespace)) {
					var overlayToAdd = getOverlayFromList(overlays, newChild.props.id);
					newChild = React.addons.cloneWithProps(newChild, {
						_overlay: overlayToAdd
					});
					//console.log(newChild, overlayToAdd);
				}
				newChildren[keys[i]] = newChild;
			}
		}

		//if (!Array.isArray(newChildren)) newChildren = [newChildren];
		// console.log(newChildren);
		return newChildren;
	},
	render() {
		//throw new Error();
		// console.log('rendering dataseries...');
		return (
			<g>{this.renderChildren()}</g>
		);
	}
});

module.exports = DataSeries;
