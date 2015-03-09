'use strict';
var React = require('react');
var Utils = require('./utils/utils')
var EdgeCoordinate = require('./edge-coordinate')


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

		// _overlay: React.PropTypes.object, // needed only when forSeries is present
		// _item: React.PropTypes.object.isRequired, // depending on first/last/current
		_value: React.PropTypes.any.isRequired, // value to be displayed

		_width: React.PropTypes.number.isRequired,
		_x1: React.PropTypes.number.isRequired,
		_x2: React.PropTypes.number.isRequired/*,
		_y1: React.PropTypes.number.isRequired,
		_y2: React.PropTypes.number.isRequired*/
	},
	getDefaultProps() {
		return {
			type: 'horizontal',
			orient: 'left',
			edgeAt: 'left',
			displayFormat: Utils.displayNumberFormat,
			namespace: "ReStock.EdgeIndicator"
		};
	},
	render() {
		return (
			null
		);
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