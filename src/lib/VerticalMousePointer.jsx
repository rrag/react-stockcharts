'use strict';
var React = require('react');
var EdgeCoordinate = require('./EdgeCoordinate')
var Utils = require('./utils/utils')


class VerticalMousePointer extends React.Component {
	shouldComponentUpdate(nextProps, nextState, nextContext) {
		return nextProps.mouseXY !== this.props.mouseXY
	}
	render() {
		return (
			<g className={'crosshair '}>
				<EdgeCoordinate
					type="vertical"
					className="horizontal"
					show={true}
					x1={this.props.mouseXY[0]} y1={0}
					x2={this.props.mouseXY[0]} y2={this.props.height}
					coordinate={this.props.xDisplayValue}
					edgeAt={this.props.height}
					orient="bottom"
					/>
				
			</g>
		);
	}
};

VerticalMousePointer.propTypes = {
	height: React.PropTypes.number.isRequired,
	mouseXY: React.PropTypes.array.isRequired,
	xDisplayValue: React.PropTypes.string.isRequired,
}

VerticalMousePointer.defaultProps = { namespace: "ReStock.VerticalMousePointer" };

VerticalMousePointer.yAccessor = (d) => ({open: d.open, high: d.high, low: d.low, close: d.close});

module.exports = VerticalMousePointer;
