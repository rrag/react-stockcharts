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
	getInitialState() {
		return {};
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
			var eventData = this.props._eventStore.get();
			this.props._eventStore.get().mouseOver.set({'value': false});
			this.props._eventStore.get().set({ pan: false });
			this.setState({ dragging: false })
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
			var eventData = this.props._eventStore.get();
			var newPos = Utils.mousePosition(e);
			var oldPos = eventData.mouseXY;
			if (! (oldPos[0] === newPos[0] && oldPos[1] === newPos[1])) {
				if (this.state.dragging) {
					eventData = eventData.set({ dx: (newPos[0] - oldPos[0]) * 1.5 });
				}
				eventData = eventData.set( { mouseXY: newPos } );
				eventData = eventData.set({ pan: this.state.dragging });
				// console.log('eventData....', eventData);
			}
		}
	},
	handleMouseDown(e) {
		if (this.props._eventStore) {
			this.props._eventStore.get().inFocus.set({'value': true});
			if (this.props.pan && this.props._zoomEventStore) {
				this.setState({
					dragging: true/*,
					dragOrigin: Utils.mousePosition(e)*/
				})
				// this.props._zoomEventStore.get().set({ dragging: true });
			}
		}
		e.preventDefault();
	},
	handleMouseUp(e) {
		if (this.props.pan && this.props._zoomEventStore) {
			this.setState({ dragging: false/*, dragOrigin: [0, 0]*/ })
		}
		e.preventDefault();
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