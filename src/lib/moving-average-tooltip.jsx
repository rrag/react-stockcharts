'use strict';

var React = require('react');
var Utils = require('./utils/utils')

var SingleMAToolTip = React.createClass({
	propTypes: {
		origin: React.PropTypes.array.isRequired,
		color: React.PropTypes.string.isRequired,
		displayName: React.PropTypes.string.isRequired,
		value: React.PropTypes.string.isRequired,
		onClick: React.PropTypes.func
	},
	getDefaultProps() {

	},
	handleClick(overlay) {
		if (this.props.onClick) {
			this.props.onClick(overlay);
		}
	},
	render() {
		var translate = "translate(" + this.props.origin[0] + ", " + this.props.origin[1] + ")";
		return (
			<g transform={translate}>
				<line x1={0} y1={2} x2={0} y2={28} stroke={this.props.color} />
				<text x={5} y={11} className="legend">
					<tspan className="tooltip-label">{this.props.displayName}</tspan>
					<tspan x="5" dy="15">{this.props.value}</tspan>
				</text>
				<rect x={0} y={0} width={55} height={30} onClick={this.handleClick.bind(this, this.props.overlay)}/>
			</g>
		);
	}
});


var MovingAverageTooltip = React.createClass({
	propTypes: {
		_currentItem: React.PropTypes.object.isRequired,
		_overlays: React.PropTypes.array.isRequired,
		displayFormat: React.PropTypes.func.isRequired,
		origin: React.PropTypes.array.isRequired,
		onClick: React.PropTypes.func
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.MovingAverageTooltip",
			displayFormat: Utils.displayNumberFormat,
			origin: [0, 10],
			width: 65
		}
	},
	render() {
		return (
			<g transform={"translate(" + this.props.origin[0] + ", " + this.props.origin[1] + ")"} className="ma-container">
				{this.props._overlays.map((eachOverlay, idx) => {
					var yValue = eachOverlay.yAccessor(this.props._currentItem);
					// console.log(yValue);
					var yDisplayValue = yValue ? this.props.displayFormat(yValue) : "n/a";
					return <SingleMAToolTip 
						key={idx}
						origin={[this.props.width * idx, 0]}
						color={eachOverlay.stroke}
						displayName={eachOverlay.tooltipLabel}
						value={yDisplayValue}
						overlay={eachOverlay}
						onClick={this.props.onClick} />
				})}
			</g>
		);
	}
});

module.exports = MovingAverageTooltip;
