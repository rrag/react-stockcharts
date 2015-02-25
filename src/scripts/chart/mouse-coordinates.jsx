'use strict';
var React = require('react/addons');
var PureRenderMixin = React.addons.PureRenderMixin;
var Utils = require('../utils/utils.js')

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
			_show: false
		}
	},
	render() {
		console.log('showing mouse coordinates');
		return (
			<g>
			</g>
		);
	}
});

module.exports = MouseCoordinates;

/*				

*/