'use strict';
var React = require('react');
var Utils = require('./utils/utils.js')

var EventCapture = React.createClass({
	propTypes: {
		mouseMove: React.PropTypes.bool.isRequired,
		zoom: React.PropTypes.bool.isRequired,
		pan: React.PropTypes.bool.isRequired,
		_height: React.PropTypes.number.isRequired,
		_width: React.PropTypes.number.isRequired,
		_eventStore: React.PropTypes.object.isRequired
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.EventCapture"
			, mouseMove: false
			, zoom: false
			, pan: false
		}
	},
	handleEnter() {
		if (this.props._eventStore) {
			//console.log('in');
			this.props._eventStore.get().mouseOver.set({'value': true});
		}
	},
	handleLeave() {
		if (this.props._eventStore) {
			//console.log('out');
			this.props._eventStore.get().mouseOver.set({'value': false});
		}
	},
	handleMouseMove(e) {
		if (this.props._eventStore && this.props.mouseMove) {
			this.props._eventStore.get().mouseXY.set(Utils.mousePosition(e));
		}
	},
	handleMouseDown(e) {
		if (this.props._eventStore) {
			this.props._eventStore.get().inFocus.set({'value': true});
			if (this.props.pan) {

			}
		}
		e.preventDefault();
	},
	handleMouseUp(e) {

	},
	handleWheel(e) {
		if (this.props._eventStore && this.props._eventStore.get().inFocus.value) {
			e.preventDefault();
			//if (this.props.)
		}
	},
	render() {
		return (
			<g>
				<rect width={this.props._width} height={this.props._height} style={{opacity: 0}}
					onMouseEnter={this.handleEnter}
					onMouseLeave={this.handleLeave}
					onMouseMove={this.handleMouseMove}
					onMouseDown={this.handleMouseDown}
					onMouseUp={this.handleMouseUp}
					onWheel={this.handleWheel} />
			</g>
		);
	}
});

module.exports = EventCapture;

/*				

*/