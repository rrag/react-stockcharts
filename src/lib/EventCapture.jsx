"use strict";

import React from "react";
import d3 from "d3";

import Utils from "./utils/utils";

var mousemove = "mousemove.pan", mouseup = "mouseup.pan";

function d3Window(node) {
	var d3win = node && (node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView);
	return d3win;
}

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
		this.handlePanEnd = this.handlePanEnd.bind(this);
		this.handlePan = this.handlePan.bind(this);
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
			if (!this.context.panInProgress) {
				var newPos = Utils.mousePosition(e);
				this.context.onMouseMove(newPos);
			}
		}
	}
	handleMouseDown(e) {
		var mouseEvent = e || d3.event;

		var chartData = this.context.chartData.filter((each) => each.id === this.props.mainChart) [0];
		if (this.props.pan && this.context.onPanStart) {
			var mouseXY = Utils.mousePosition(mouseEvent);
			this.context.onPanStart(chartData.plot.scales.xScale.domain(), mouseXY);

			var dx = mouseEvent.pageX - mouseXY[0],
				dy = mouseEvent.pageY - mouseXY[1];

			var win = d3Window(React.findDOMNode(this.refs.capture));
			d3.select(win)
				.on(mousemove, this.handlePan)
				.on(mouseup, this.handlePanEnd);

			this.setState({
				deltaXY: [dx, dy]
			});
		} else {
			if (!this.context.focus && this.context.onFocus) this.context.onFocus(true);
		}
		mouseEvent.preventDefault();
	}
	handlePan() {
		var deltaXY = this.state.deltaXY;
		var newPos = [d3.event.pageX - deltaXY[0], d3.event.pageY - deltaXY[1]];
		// console.log("moved from- ", startXY, " to ", newPos);
		if (this.props.pan && this.context.onPan) {
			var chartData = this.context.chartData.filter((each) => each.id === this.props.mainChart) [0];
			this.context.onPan(newPos, chartData.plot.scales.xScale.domain());
		}
	}
	handlePanEnd() {
		var win = d3Window(React.findDOMNode(this.refs.capture));

		d3.select(win)
			.on(mousemove, null)
			.on(mouseup, null);
		if (this.props.pan && this.context.onPanEnd) {
			this.context.onPanEnd();
		}
		// e.preventDefault();
	}
	render() {
		var className = this.context.panInProgress ? "react-stockcharts-grabbing-cursor" : "react-stockcharts-crosshair-cursor";

		return (
			<rect ref="capture"
				className={className}
				width={this.context.width} height={this.context.height} style={{ opacity: 0 }}
				onMouseEnter={this.handleEnter}
				onMouseLeave={this.handleLeave}
				onMouseMove={this.handleMouseMove}
				onWheel={this.handleWheel}
				onMouseDown={this.handleMouseDown}
				/>
		);
	}
}

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
	namespace: "ReStock.EventCapture",
	mouseMove: false,
	zoom: false,
	zoomMultiplier: 1,
	pan: false,
	panSpeedMultiplier: 1,
	defaultFocus: false
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
