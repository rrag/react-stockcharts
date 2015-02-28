'use strict';
var React = require('react'),
	PureRenderMixin = require('../mixin/restock-pure-render-mixin'),
	Utils = require('../utils/utils');

var CurrentCoordinate = React.createClass({
	//namespace: "ReStock.DataSeries",
	mixins: [PureRenderMixin],
	propTypes: {
		_showCurrent: React.PropTypes.bool.isRequired,
		_xScale: React.PropTypes.func.isRequired,
		_yScale: React.PropTypes.func.isRequired,
		_xAccessor: React.PropTypes.func.isRequired,
		_yAccessor: React.PropTypes.func.isRequired,
		_currentItem: React.PropTypes.object
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.CurrentCoordinate"
		};
	},
	render() {
		var content = null;
		if (this.props._showCurrent && this.props._xAccessor(this.props._currentItem) !== undefined) {
			var x = this.props._xScale(this.props._xAccessor(this.props._currentItem));
			var y = this.props._yScale(this.props._yAccessor(this.props._currentItem));
			content = <circle cx={x} cy={y} r={2} />;
		}
		return (
			<g className="current-coordinate">{content}</g>
		);
	}
});

module.exports = CurrentCoordinate;
