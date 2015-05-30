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
		defaultFocus: React.PropTypes.bool.isRequired,
	},
	getInitialState() {
		return {
			dragOrigin: [0, 0],
			defaultFocus: false
		};
	},
	contextTypes: {
		_width: React.PropTypes.number.isRequired,
		_height: React.PropTypes.number.isRequired,
		// _eventStore: React.PropTypes.object.isRequired,
		// _zoomEventStore: React.PropTypes.object,
		_chartData: React.PropTypes.array,
		onMouseMove: React.PropTypes.func,
		onMouseEnter: React.PropTypes.func,
		onMouseLeave: React.PropTypes.func,
		onZoom: React.PropTypes.func,
		onPan: React.PropTypes.func,
	},
	componentWillMount() {
		this.setState({
			className: this.props.className,
			inFocus: this.props.defaultFocus
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
			, defaultFocus: false
		}
	},
	toggleFocus() {
		this.setFocus(!this.state.defaultFocus);
	},
	setFocus(focus) {
		this.setState({
			defaultFocus: focus
		});
	},
	handleEnter() {
		if (this.context.onMouseEnter) {
			this.context.onMouseEnter();
		}
	},
	handleLeave() {
		if (this.context.onMouseLeave) {
			this.context.onMouseLeave();
		}
		/*if (this.context._eventStore) {
			// console.log('out');
			var eventData = this.context._eventStore.get();
			this.context._eventStore.get().mouseOver.set({'value': false});
			this.context._eventStore.get().set({ pan: false });
			this.setState({
				dragging: false,
				dragOrigin: [0, 0],
				className: this.props.className
			})
		}*/
	},
	handleWheel(e) {
		if (this.props.zoom
				&& this.context._eventStore
				//&& this.context._eventStore.get().inFocus.value
				&& this.state.inFocus
				&& this.context._zoomEventStore) {
			e.stopPropagation();
			e.preventDefault();
			var zoomDir = e.deltaY > 0 ? this.props.zoomMultiplier : -this.props.zoomMultiplier;
			//console.log(zoomDir);

			this.context._zoomEventStore.get().set({ zoom : zoomDir });
		}
	},
	handleMouseMove(e) {
		if (this.context._eventStore && this.props.mouseMove) {
			var eventData = this.context._eventStore.get();
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
		if (this.context._eventStore) {
			// this.context._eventStore.get().inFocus.set({'value': true});
			var inFocus = true
			if (this.props.pan && this.context._zoomEventStore) {
				var chartData = this.context._chartData.filter((each) => each.id === this.props.mainChart) [0];
				this.setState({
					dragging: true,
					dragOrigin: Utils.mousePosition(e),
					dragOriginDomain: chartData.scales.xScale.domain(),
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
	handleMouseUp(e) {
		if (this.props.pan && this.context._zoomEventStore) {

			this.context._eventStore.get().set({ pan: false })
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
				width={this.context._width} height={this.context._height} style={{opacity: 0}}
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
