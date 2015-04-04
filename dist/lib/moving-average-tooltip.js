'use strict';

var React = require('react');
var Utils = require('./utils/utils')

var SingleMAToolTip = React.createClass({displayName: "SingleMAToolTip",
	propTypes: {
		origin: React.PropTypes.array.isRequired,
		color: React.PropTypes.string.isRequired,
		displayName: React.PropTypes.string.isRequired,
		value: React.PropTypes.string.isRequired,
		onClick: React.PropTypes.func
	},
	getDefaultProps:function() {

	},
	handleClick:function(overlay) {
		if (this.props.onClick) {
			this.props.onClick(overlay);
		}
	},
	render:function() {
		var translate = "translate(" + this.props.origin[0] + ", " + this.props.origin[1] + ")";
		return (
			React.createElement("g", {transform: translate}, 
				React.createElement("line", {x1: 0, y1: 2, x2: 0, y2: 28, stroke: this.props.color}), 
				React.createElement("text", {x: 5, y: 11, className: "legend"}, 
					React.createElement("tspan", {className: "tooltip-label"}, this.props.displayName), 
					React.createElement("tspan", {x: "5", dy: "15"}, this.props.value)
				), 
				React.createElement("rect", {x: 0, y: 0, width: 55, height: 30, onClick: this.handleClick.bind(this, this.props.overlay)})
			)
		);
	}
});


var MovingAverageTooltip = React.createClass({displayName: "MovingAverageTooltip",
	propTypes: {
		_currentItem: React.PropTypes.object.isRequired,
		_overlays: React.PropTypes.array.isRequired,
		displayFormat: React.PropTypes.func.isRequired,
		origin: React.PropTypes.array.isRequired,
		onClick: React.PropTypes.func
	},
	getDefaultProps:function() {
		return {
			namespace: "ReStock.MovingAverageTooltip",
			displayFormat: Utils.displayNumberFormat,
			origin: [0, 10],
			width: 65
		}
	},
	render:function() {
		return (
			React.createElement("g", {transform: "translate(" + this.props.origin[0] + ", " + this.props.origin[1] + ")", className: "ma-container"}, 
				this.props._overlays.map(function(eachOverlay, idx)  {
					var yValue = eachOverlay.yAccessor(this.props._currentItem);
					// console.log(yValue);
					var yDisplayValue = yValue ? this.props.displayFormat(yValue) : "n/a";
					return React.createElement(SingleMAToolTip, {
						key: idx, 
						origin: [this.props.width * idx, 0], 
						color: eachOverlay.stroke, 
						displayName: eachOverlay.tooltipLabel, 
						value: yDisplayValue, 
						overlay: eachOverlay, 
						onClick: this.props.onClick})
				}.bind(this))
			)
		);
	}
});

module.exports = MovingAverageTooltip;
