'use strict';
var React = require('react/addons');

var EdgeCoordinate = React.createClass({
	propTypes: {
		type: React.PropTypes.oneOf(['vertical', 'horizontal']).isRequired,
		coordinate: React.PropTypes.any.isRequired,
		x1: React.PropTypes.number.isRequired,
		y1: React.PropTypes.number.isRequired,
		x2: React.PropTypes.number.isRequired,
		y2: React.PropTypes.number.isRequired,
		orient: React.PropTypes.oneOf(['bottom', 'top', 'left', 'right']),
		rectWidth: React.PropTypes.number
	},
	getDefaultProps: function() {
		return {
			orient: 'left'
		};
	},
	render: function() {
		if (!this.props.show) return null;

		var displayCoordinate = this.props.coordinate;
		var rectWidth = this.props.rectWidth
			? this.props.rectWidth
			: (this.props.type === 'horizontal')
				? 60
				: 100,
			rectHeight = 20;

		var edgeXRect, edgeYRect, edgeXText, edgeYText;

		if (this.props.type === 'horizontal') {

			edgeXRect = (this.props.orient === 'right') ? this.props.edgeAt + 1 : this.props.edgeAt - rectWidth - 1;
			edgeYRect = this.props.y1 - (rectHeight / 2);
			edgeXText = (this.props.orient === 'right') ? this.props.edgeAt + (rectWidth / 2) : this.props.edgeAt - (rectWidth / 2);
			edgeYText = this.props.y1;
		} else {
			edgeXRect = this.props.x1 - (rectWidth / 2);
			edgeYRect = (this.props.orient === 'bottom') ? this.props.edgeAt : this.props.edgeAt - rectHeight;
			edgeXText = this.props.x1;
			edgeYText = (this.props.orient === 'bottom') ? this.props.edgeAt + (rectHeight / 2) : this.props.edgeAt - (rectHeight / 2);
		}
		var coordinateBase = null, coordinate = null;
		if (displayCoordinate !== undefined) {
				coordinateBase = (<rect key={1} className="textbg"
									x={edgeXRect}
									y={edgeYRect}
									height={rectHeight} width={rectWidth} fill={this.props.fill} />);
				coordinate = (<text key={2} x={edgeXText}
									y={edgeYText}
									style={{"textAnchor": "middle"}}
									dy=".32em">{displayCoordinate}</text>);
		}
		return (
			<g className={(this.props.show ? 'show ' : 'hide ') + this.props.className}>
					<line className="cross-hair"
						x1={this.props.x1} y1={this.props.y1}
						x2={this.props.x2} y2={this.props.y2} />
					{coordinateBase}
					{coordinate}
			</g>
		);
	}
});

module.exports = EdgeCoordinate;
