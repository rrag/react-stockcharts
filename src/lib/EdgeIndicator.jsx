'use strict';
var React = require('react');
var Utils = require('./utils/utils')
var EdgeCoordinate = require('./EdgeCoordinate')


var EdgeIndicator = React.createClass({
	propTypes: {
		type: React.PropTypes.oneOf(['horizontal']).isRequired,
		className: React.PropTypes.string,
		itemType: React.PropTypes.oneOf(['first', 'last', 'current']).isRequired,
		orient: React.PropTypes.oneOf(['left', 'right']),
		edgeAt: React.PropTypes.oneOf(['left', 'right']),

		forChart: React.PropTypes.number.isRequired,
		forOverlay: React.PropTypes.number, // undefined means main Data series of that chart

		displayFormat: React.PropTypes.func.isRequired,

		_width: React.PropTypes.number,
		_currentItem: React.PropTypes.object.isRequired,
		_chart: React.PropTypes.object.isRequired,
	},
	getDefaultProps() {
		return {
			type: 'horizontal',
			orient: 'left',
			edgeAt: 'left',
			displayFormat: Utils.displayNumberFormat,
			yAxisPad: 5,
			namespace: "ReStock.EdgeIndicator"
		};
	},/*
	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.itemType === 'current') {
			return 
		} else {

		}
	},*/
	renderEdge() {
		var edge = null, item, yAccessor;
		if (this.props.forOverlay !== undefined
				&& this.props._chart.overlays.length > 0
				&& this.props._chart.overlayValues.length > 0) {

			var overlay = this.props._chart.overlays
				.filter((eachOverlay) => eachOverlay.id === this.props.forOverlay);
			var overlayValue = this.props._chart.overlayValues
				.filter((eachOverlayValue) => eachOverlayValue.id === this.props.forOverlay);

			// console.log(overlay, overlayValue);
			if (overlay.length !== 1) {
				console.warn('%s overlays found with id %s, correct the OverlaySeries so there is exactly one for each id', overlay.length, newChild.props.forOverlay)
				throw new Error('Unable to identify unique Overlay for the id');
			}
			if (overlayValue.length !== 1 && overlay.length === 1) {
				console.warn('Something is wrong!!!, There should be 1 overlayValue, report the issue on github');
			}

			item = this.props.itemType === 'first'
				? overlayValue[0].first
				: this.props.itemType === 'last'
					? overlayValue[0].last
					: this.props._currentItem;
			yAccessor = overlay[0].yAccessor;

			if (item !== undefined) {
				var yValue = yAccessor(item), xValue = this.props._chart.accessors.xAccessor(item);
				var x1 = Math.round(this.props._chart.scales.xScale(xValue)), y1 = Math.round(this.props._chart.scales.yScale(yValue));
				var edgeX = this.props.edgeAt === 'left'
					? 0 - this.props.yAxisPad
					: this.props._width + this.props.yAxisPad

				edge = <EdgeCoordinate
						type={this.props.type}
						className="edge-coordinate"
						fill={overlay[0].stroke}
						show={true}
						x1={x1 + this.props._chart.origin[0]} y1={y1 + this.props._chart.origin[1]}
						x2={edgeX + this.props._chart.origin[0]} y2={y1 + this.props._chart.origin[1]}
						coordinate={this.props.displayFormat(yValue)}
						edgeAt={edgeX}
						orient={this.props.orient}
						/>
			}
		} else if (this.props.forOverlay === undefined) {
			item = this.props.itemType === 'first'
				? this.props._chart.firstItem
				: this.props.itemType === 'last'
					? this.props._chart.lastItem
					: this.props._currentItem;
			yAccessor = this.props._chart.accessors.yAccessor;

			if (item !== undefined && yAccessor !== null) {
				var yValue = yAccessor(item);
				var xValue = this.props._chart.accessors.xAccessor(item);

				var x1 = Math.round(this.props._chart.scales.xScale(xValue)), y1 = Math.round(this.props._chart.scales.yScale(yValue));
				var edgeX = this.props.edgeAt === 'left'
					? 0 - this.props.yAxisPad
					: this.props._width + this.props.yAxisPad

				edge = <EdgeCoordinate
						type={this.props.type}
						className="edge-coordinate"
						show={true}
						x1={x1 + this.props._chart.origin[0]} y1={y1 + this.props._chart.origin[1]}
						x2={edgeX + this.props._chart.origin[0]} y2={y1 + this.props._chart.origin[1]}
						coordinate={this.props.displayFormat(yValue)}
						edgeAt={edgeX}
						orient={this.props.orient}
						/>
			}
		}
		return edge;
	},
	render() {
		return this.renderEdge();
	}
});

module.exports = EdgeIndicator;

/*
<EdgeCoordinate
				type={this.props.type}
				className={this.props.className}
				show={true}
				x1={this.props._x1} y1={this.props._y1}
				x2={this.props._width + this.props.yAxisPad} y2={this.props._mouseXY[1]}
				coordinate={this.props._yDisplayValue}
				edgeAt={this.props._width + this.props.yAxisPad}
				orient="right"
				/>
*/