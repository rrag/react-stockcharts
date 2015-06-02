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
		onPanStart: React.PropTypes.func,
		onPan: React.PropTypes.func,
		onPanEnd: React.PropTypes.func,
		panInProgress: React.PropTypes.bool,
		focus: React.PropTypes.bool.isRequired,
		onFocus: React.PropTypes.func,
	},
	componentWillMount() {
		if (this.context.onFocus) this.context.onFocus(this.props.defaultFocus);
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
	componentWillReceiveProps(nextProps, nextContext) {
		// console.log('hererasdfdsfs');
	},
	toggleFocus() {
		this.setFocus(!this.state.inFocus);
	},
	setFocus(focus) {
		this.setState({
			inFocus: focus
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
	},
	handleWheel(e) {
		if (this.props.zoom
				&& this.context.onZoom
				&& this.context.focus) {
			e.stopPropagation();
			e.preventDefault();
			var zoomDir = e.deltaY > 0 ? this.props.zoomMultiplier : -this.props.zoomMultiplier;
			var newPos = Utils.mousePosition(e);
			this.context.onZoom(zoomDir, newPos);
		}
	},
	handleMouseMove(e) {
		if (this.context.onMouseMove && this.props.mouseMove) {
			var newPos = Utils.mousePosition(e);
			if (this.context.panInProgress) {
				if (this.props.pan && this.context.onPan) {
					var chartData = this.context._chartData.filter((each) => each.id === this.props.mainChart) [0];
					this.context.onPan(newPos, chartData.plot.scales.xScale.domain());
				}
			} else {
				this.context.onMouseMove(newPos);
			}
		}
	},
	handleMouseDown(e) {
		var inFocus = true
		var chartData = this.context._chartData.filter((each) => each.id === this.props.mainChart) [0];
		if (this.props.pan && this.context.onPanStart) {
			var mouseXY = Utils.mousePosition(e);
			this.context.onPanStart(chartData.plot.scales.xScale.domain(), mouseXY)
		} else {
			if (!this.context.focus && this.context.onFocus) this.context.onFocus(true);
		}
		e.preventDefault();
	},
	handleMouseUp(e) {
		if (this.props.pan && this.context.onPanEnd) {
			this.context.onPanEnd();
		}
		e.preventDefault();
	},
	render() {
		var className = this.context.panInProgress ? 'grabbing' : 'crosshair';
		return (
			<rect 
				className={className}
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
