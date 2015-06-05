'use strict';
var React = require('react');
var Utils = require('./utils/utils.js')

class EventCapture extends React.Component {
	constructor(props) {
		super(props);
		this.toggleFocus = this.toggleFocus.bind(this);
		this.setFocus = this.setFocus.bind(this);
		this.handleEnter = this.handleEnter.bind(this);
		this.handleLeave = this.handleLeave.bind(this);
		this.handleWheel = this.handleWheel.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
	}
	componentWillMount() {
		if (this.context.onFocus) this.context.onFocus(this.props.defaultFocus);
	}
	toggleFocus() {
		this.setFocus(!this.state.inFocus);
	}
	setFocus(focus) {
		this.setState({
			inFocus: focus
		});
	}
	handleEnter() {
		if (this.context.onMouseEnter) {
			this.context.onMouseEnter();
		}
	}
	handleLeave() {
		if (this.context.onMouseLeave) {
			this.context.onMouseLeave();
		}
	}
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
	}
	handleMouseMove(e) {
		if (this.context.onMouseMove && this.props.mouseMove) {
			var newPos = Utils.mousePosition(e);
			if (this.context.panInProgress) {
				if (this.props.pan && this.context.onPan) {
					var chartData = this.context.chartData.filter((each) => each.id === this.props.mainChart) [0];
					this.context.onPan(newPos, chartData.plot.scales.xScale.domain());
				}
			} else {
				this.context.onMouseMove(newPos);
			}
		}
	}
	handleMouseDown(e) {
		var inFocus = true
		var chartData = this.context.chartData.filter((each) => each.id === this.props.mainChart) [0];
		if (this.props.pan && this.context.onPanStart) {
			var mouseXY = Utils.mousePosition(e);
			this.context.onPanStart(chartData.plot.scales.xScale.domain(), mouseXY)
		} else {
			if (!this.context.focus && this.context.onFocus) this.context.onFocus(true);
		}
		e.preventDefault();
	}
	handleMouseUp(e) {
		if (this.props.pan && this.context.onPanEnd) {
			this.context.onPanEnd();
		}
		e.preventDefault();
	}
	render() {
		var className = this.context.panInProgress ? 'grabbing' : 'crosshair';
		return (
			<rect 
				className={className}
				width={this.context.width} height={this.context.height} style={{opacity: 0}}
				onMouseEnter={this.handleEnter}
				onMouseLeave={this.handleLeave}
				onMouseMove={this.handleMouseMove}
				onMouseDown={this.handleMouseDown}
				onMouseUp={this.handleMouseUp}
				onWheel={this.handleWheel}
				/>
		);
	}
};

EventCapture.propTypes = {
	mainChart: React.PropTypes.number.isRequired,
	mouseMove: React.PropTypes.bool.isRequired,
	zoom: React.PropTypes.bool.isRequired,
	zoomMultiplier: React.PropTypes.number.isRequired,
	pan: React.PropTypes.bool.isRequired,
	panSpeedMultiplier: React.PropTypes.number.isRequired,
	defaultFocus: React.PropTypes.bool.isRequired,
};
EventCapture.defaultProps = {
	namespace: "ReStock.EventCapture"
	, mouseMove: false
	, zoom: false
	, zoomMultiplier: 1
	, pan: false
	, panSpeedMultiplier: 1
	, className: "crosshair"
	, defaultFocus: false
};
EventCapture.contextTypes = {
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
	chartData: React.PropTypes.array,
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
};

module.exports = EventCapture;
