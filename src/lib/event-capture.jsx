'use strict';
var React = require('react');
var Utils = require('./utils/utils.js')

var EventCapture = React.createClass({
	propTypes: {
		mainChart: React.PropTypes.number.isRequired,
		mouseMove: React.PropTypes.bool.isRequired,
		zoom: React.PropTypes.bool.isRequired,
		pan: React.PropTypes.bool.isRequired,
		_height: React.PropTypes.number.isRequired,
		_width: React.PropTypes.number.isRequired,
		_eventStore: React.PropTypes.object.isRequired,
		_zoomEventStore: React.PropTypes.object
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
			// console.log('in');
			this.props._eventStore.get().mouseOver.set({'value': true});
		}
	},
	handleLeave() {
		if (this.props._eventStore) {
			// console.log('out');
			this.props._eventStore.get().mouseOver.set({'value': false});
		}
	},
	handleWheel(e) {
		if (this.props.zoom
				&& this.props._eventStore
				&& this.props._eventStore.get().inFocus.value
				&& this.props._zoomEventStore) {
			e.stopPropagation();
			e.preventDefault();
			var speed = 1,
				zoomDir = e.deltaY > 0 ? speed : -speed;
			//console.log(zoomDir);

			this.props._zoomEventStore.get().set({ zoom : zoomDir });
		}
	},
	handleMouseMove(e) {
		if (this.props._eventStore && this.props.mouseMove) {
			var newPos = Utils.mousePosition(e);
			var oldPos = this.props._eventStore.get().mouseXY;
			if (! (oldPos[0] === newPos[0] && oldPos[1] === newPos[1])) {
				this.props._eventStore.get().mouseXY.set(newPos);
			}
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
	render() {
		return (
			<rect width={this.props._width} height={this.props._height} style={{opacity: 0}}
				onMouseEnter={this.handleEnter}
				onMouseLeave={this.handleLeave}
				onMouseMove={this.handleMouseMove}
				onMouseDown={this.handleMouseDown}
				onMouseUp={this.handleMouseUp}
				onWheel={this.handleWheel}
				/>
		);
	}
});

module.exports = EventCapture;

/*				

*/