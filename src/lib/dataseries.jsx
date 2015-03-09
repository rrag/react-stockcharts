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

		_xScale: React.PropTypes.func,
		_yScale: React.PropTypes.func,

		// _currentMouseXY: React.PropTypes.array,
		// _currentXYValue: React.PropTypes.array,
		_currentItem: React.PropTypes.object,
		_lastItem: React.PropTypes.object,
		_firstItem: React.PropTypes.object,
		_overlays: React.PropTypes.array,
		_updateMode: React.PropTypes.object
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.DataSeries"
		};
	},
	componentWillReceiveProps(nextProps) {

		var xAccessor = nextProps.xAccessor || nextProps._xAccessor;
		var yAccessor = nextProps.yAccessor;

		// TODO
		// if overlays are different, recalculate the data for the overlay that changed
		/*
		if (nextProps._mouseXY !== this.props._mouseXY) {
			if (nextProps._currentItem) {

				var xValue = nextProps._xScale.invert(nextProps._mouseXY[0]);
				var item = Utils.getClosestItem(nextProps.data, xValue, xAccessor);
				var currentItem = nextProps._currentItem.reset(item); 
			}
		}*/
		if (false /* do this only when the (first or last) data or xScale or yScale is different, FIXME later */) {
			if (nextProps._lastItem) {
				var last = Utils.cloneMe(nextProps.data[nextProps.data.length - 1]);
				var lastItem = nextProps._lastItem.reset(last);
			}
			if (nextProps._firstItem) {
				var first = Utils.cloneMe(nextProps.data[0]);
				var firstItem = nextProps._firstItem.reset(first);
			}
		}
	},
	componentWillMount() {
		var last = Utils.cloneMe(this.props.data[this.props.data.length - 1]);
		var lastItem = this.props._lastItem.reset(last);
		// console.log(lastItem);

		var first = Utils.cloneMe(this.props.data[0]);
		var firstItem = this.props._firstItem.reset(first);
		// console.log(firstItem);
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
			}/* else {
				newChild = React.addons.cloneWithProps(newChild, {
					_xScale: this.props._xScale,
					_yScale: this.props._yScale,
					_xAccessor: (this.props.xAccessor || this.props._xAccessor),
					_yAccessor: this.props.yAccessor,
					//_currentItem: this.props._currentItem,
					//_showCurrent: this.props._showCurrent
				});
			}*/

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
