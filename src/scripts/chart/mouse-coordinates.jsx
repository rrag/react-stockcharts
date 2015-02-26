'use strict';
var React = require('react/addons');
var PureRenderMixin = React.addons.PureRenderMixin;
var EdgeCoordinate = require('./edge-coordinate')

var MouseCoordinates = React.createClass({
	propTypes: {
		_height: React.PropTypes.number.isRequired,
		_width: React.PropTypes.number.isRequired,
		_show: React.PropTypes.bool.isRequired,
		_mouseXY: React.PropTypes.object.isRequired
	},
	mixins: [PureRenderMixin],
	getDefaultProps() {
		return {
			namespace: "ReStock.MouseCoordinates",
			_show: false
		}
	},
	render() {
		console.log('showing mouse coordinates', this.props._currentItem.value);
		//var crossHairX = this.props._xScale(this.props.currentItem.index);

		return (
			<g className={this.props._show ? 'show' : 'hide'}>
			</g>
		);
	}
});

module.exports = MouseCoordinates;


/*
				<EdgeCoordinate
					type="horizontal"
					className="horizontal"
					show={true}
					x1={0} y1={this.props._mouseXY[1]}
					x2={this.props.width + this.props.yAxisPad} y2={this.props._mouseXY[1]}
					coordinate={this.props.yScale.invert(this.props._mouseXY[1])}
					edgeAt={this.props.width + this.props.yAxisPad}
					orient="right"
					/>
				<EdgeCoordinate
					type="vertical"
					className="horizontal"
					show={true}
					x1={crossHairX} y1={0}
					x2={crossHairX} y2={this.props.height}
					coordinate={this.props.currentItem.displayDate}
					edgeAt={this.props.height}
					orient="bottom"
					/>

*/