'use strict';
var React = require('react');
var Utils = require('./utils/utils.js')

var EventCapture = React.createClass({displayName: "EventCapture",
	propTypes: {
		mainChart: React.PropTypes.number.isRequired,
		mouseMove: React.PropTypes.bool.isRequired,
		zoom: React.PropTypes.bool.isRequired,
		zoomMultiplier: React.PropTypes.number.isRequired,
		pan: React.PropTypes.bool.isRequired,
		panSpeedMultiplier: React.PropTypes.number.isRequired,
		defaultFocus: React.PropTypes.bool.isRequired,

		_chartData: React.PropTypes.object.isRequired,
		_height: React.PropTypes.number.isRequired,
		_width: React.PropTypes.number.isRequired,
		_eventStore: React.PropTypes.object.isRequired,
		_zoomEventStore: React.PropTypes.object
	},
	getInitialState:function() {
		return {
			dragOrigin: [0, 0],
			defaultFocus: false
		};
	},
	componentWillMount:function() {
		this.setState({
			className: this.props.className,
			inFocus: this.props.defaultFocus
		});
	},
	getDefaultProps:function() {
		return {
			namespace: "ReStock.EventCapture"
			, mouseMove: false
			, zoom: false
			, zoomMultiplier: 1
			, pan: false
			, panSpeedMultiplier: 1
			, className: "crosshair"
			, defaultFocus: false
		}
	},
	toggleFocus:function() {
		this.setFocus(!this.state.defaultFocus);
	},
	setFocus:function(focus) {
		this.setState({
			defaultFocus: focus
		});
	},
	handleEnter:function() {
		if (this.props._eventStore) {
			// console.log('in');
			this.props._eventStore.get().mouseOver.set({'value': true});
		}
	},
	handleLeave:function() {
		if (this.props._eventStore) {
			// console.log('out');
			var eventData = this.props._eventStore.get();
			this.props._eventStore.get().mouseOver.set({'value': false});
			this.props._eventStore.get().set({ pan: false });
			this.setState({
				dragging: false,
				dragOrigin: [0, 0],
				className: this.props.className
			})
		}
	},
	handleWheel:function(e) {
		if (this.props.zoom
				&& this.props._eventStore
				//&& this.props._eventStore.get().inFocus.value
				&& this.state.inFocus
				&& this.props._zoomEventStore) {
			e.stopPropagation();
			e.preventDefault();
			var zoomDir = e.deltaY > 0 ? this.props.zoomMultiplier : -this.props.zoomMultiplier;
			//console.log(zoomDir);

			this.props._zoomEventStore.get().set({ zoom : zoomDir });
		}
	},
	handleMouseMove:function(e) {
		if (this.props._eventStore && this.props.mouseMove) {
			var eventData = this.props._eventStore.get();
			var newPos = Utils.mousePosition(e);
			//var oldPos = eventData.mouseXY;
			var startPos = this.state.dragOrigin;
			if (! (startPos[0] === newPos[0] && startPos[1] === newPos[1])) {
				if (this.state.dragging) {
					eventData = eventData.set({
						dx: (newPos[0] - startPos[0]) * this.props.panSpeedMultiplier,
						dragOriginDomain: this.state.dragOriginDomain
					});

				}
				eventData = eventData.set( { mouseXY: newPos } );
				eventData = eventData.set({ pan: this.state.dragging });
				// console.log('eventData....', eventData);
			}
		}
	},
	handleMouseDown:function(e) {
		if (this.props._eventStore) {
			// this.props._eventStore.get().inFocus.set({'value': true});
			var inFocus = true
			if (this.props.pan && this.props._zoomEventStore) {
				this.setState({
					dragging: true,
					dragOrigin: Utils.mousePosition(e),
					dragOriginDomain: this.props._chartData.scales.xScale.domain(),
					className: "grabbing",
					inFocus: inFocus
				})
			} else {
				this.setState({
					inFocus: inFocus
				})
			}
		}
		e.preventDefault();
	},
	handleMouseUp:function(e) {
		if (this.props.pan && this.props._zoomEventStore) {

			this.props._eventStore.get().set({ pan: false })
			this.setState({
				dragging: false,
				dragOrigin: [0, 0],
				className: this.props.className
			})
		}
		e.preventDefault();
	},
	render:function() {
		return (
			React.createElement("rect", {
				className: this.state.className, 
				width: this.props._width, height: this.props._height, style: {opacity: 0}, 
				onMouseEnter: this.handleEnter, 
				onMouseLeave: this.handleLeave, 
				onMouseMove: this.handleMouseMove, 
				onMouseDown: this.handleMouseDown, 
				onMouseUp: this.handleMouseUp, 
				onWheel: this.handleWheel}
				)
		);
	}
});

module.exports = EventCapture;

/*				

*/