'use strict';
var React = require('react');
var Utils = require('./utils/utils.js')

var EventCapture = React.createClass({
	propTypes: {
		mainChart: React.PropTypes.number.isRequired,
		mouseMove: React.PropTypes.bool.isRequired,
		zoom: React.PropTypes.bool.isRequired,
		zoomMultiplier: React.PropTypes.number.isRequired,
		pan: React.PropTypes.bool.isRequired,
		panSpeedMultiplier: React.PropTypes.number.isRequired,
		_chartData: React.PropTypes.object.isRequired,
		_height: React.PropTypes.number.isRequired,
		_width: React.PropTypes.number.isRequired,
		_eventStore: React.PropTypes.object.isRequired,
		_zoomEventStore: React.PropTypes.object
	},
	getInitialState() {
		return {
			dragOrigin: [0, 0]
		};
	},
	componentWillMount() {
		this.setState({
			className: this.props.className
		});
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.EventCapture"
			, mouseMove: false
			, zoom: false
			, zoomMultiplier: 1
			, pan: false
			, panSpeedMultiplier: 1
			, className: "crosshair"
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
			this.setState({
				dragging: false,
				dragOrigin: [0, 0],
				className: this.props.className
			})
		}
	},
	handleWheel(e) {
		if (this.props.zoom
				&& this.props._eventStore
				&& this.props._eventStore.get().inFocus.value
				&& this.props._zoomEventStore) {
			e.stopPropagation();
			e.preventDefault();
			var zoomDir = e.deltaY > 0 ? this.props.zoomMultiplier : -this.props.zoomMultiplier;
			//console.log(zoomDir);

			this.props._zoomEventStore.get().set({ zoom : zoomDir });
		}
	},
	handleMouseMove(e) {
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
	handleMouseDown(e) {
		if (this.props._eventStore) {
			this.props._eventStore.get().inFocus.set({'value': true});
			if (this.props.pan && this.props._zoomEventStore) {
				this.setState({
					dragging: true,
					dragOrigin: Utils.mousePosition(e),
					dragOriginDomain: this.props._chartData.scales.xScale.domain(),
					className: "grabbing"
				})
			}
		}
		e.preventDefault();
	},
	handleMouseUp(e) {
		if (this.props.pan && this.props._zoomEventStore) {
			this.setState({
				dragging: false,
				dragOrigin: [0, 0],
				className: this.props.className
			})
		}
		e.preventDefault();
	},
	render() {
		return (
			<rect 
				className={this.state.className}
				width={this.props._width} height={this.props._height} style={{opacity: 0}}
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