'use strict';
var React = require('react/addons');

var EdgeContainer = React.createClass({
	propTypes: {
		_overlays: React.PropTypes.array.isRequired,
		_currentItem: React.PropTypes.object.isRequired,
		_lastItem: React.PropTypes.object.isRequired,
		_firstItem: React.PropTypes.object.isRequired,
		_overlayValues: React.PropTypes.array.isRequired,
		//_currentMouseXY: React.PropTypes.array.isRequired,
		_height: React.PropTypes.number.isRequired,
		_width: React.PropTypes.number.isRequired,
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.EdgeContainer",
		}
	},
	renderChildren() {
		return React.Children.map(this.props.children, (child) => {
			if (typeof child.type === 'string') return child;
			var newChild = child;
			if (/EdgeIndicator$/.test(newChild.props.namespace)) {
				/*var item = newChild.props.itemType === 'first'
					? this.props._firstItem
					: newChild.props.itemType === 'last'
						? this.props._lastItem
						: this.props._currentItem;*/

				if (newChild.props.forOverlay !== undefined) {
					var overlay = this.props._overlays
						.filter((eachOverlay) => eachOverlay.id === newChild.props.forOverlay);
					var overlayValue = this.props._overlayValues
						.filter((eachOverlayValue) => eachOverlayValue.id === newChild.props.forOverlay);

					console.log(overlay, overlayValue);

					if (overlay.length !== 1) {
						console.warn('%s overlays found with same id %s, correct the OverlaySeries so there is exactly one for each id', overlay.length, newChild.props.forOverlay)
						throw new Error('Unable to identify unique Overlay for the id');
					}
					if (overlayValue.length !== 1 && overlay.length === 1) {
						console.warn('Something is wrong!!!, There should be 1 overlayValue, report the issue on github');
					}

					var item = newChild.props.itemType === 'first'
						? overlayValue[0].first
						: newChild.props.itemType === 'last'
							? overlayValue[0].last
							: this.props._currentItem;
					var value = overlay[0].yAccessor(item);
					console.log(overlay[0], overlayValue[0]);
				}

				newChild = React.addons.cloneWithProps(newChild, {
					_width: this.props._width,
					_value: value,
					//x1: 
				});
			}
			return newChild;
		});
	},
	render() {
		if (this.props._overlays.length > 0 && this.props._overlayValues.length > 0) {
			return (
				<g>{this.renderChildren()}</g>
			);
		} else {
			return null;
		}
	}
});

module.exports = EdgeContainer;
