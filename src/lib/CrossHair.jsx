"use strict";

import React from "react";
import EdgeCoordinate from "./EdgeCoordinate";

class CrossHair extends React.Component {
	constructor(props) {
		super(props);
	}
	shouldComponentUpdate(nextProps) {
		return nextProps.mouseXY !== this.props.mouseXY;
	}
	render() {
		var x1 = 0, x2 = this.props.width;
		var edges = this.props.edges.map((edge, idx) => {
			if (edge.at === "left") {
				x1 = -this.props.yAxisPad;
			}
			if (edge.at === "right") {
				x2 = this.props.width + this.props.yAxisPad;
			}
			return <EdgeCoordinate
				key={idx}
				type="horizontal"
				className="horizontal"
				show={true}
				x1={0} y1={this.props.mouseXY[1]}
				x2={0} y2={this.props.mouseXY[1]}
				coordinate={edge.yDisplayValue}
				edgeAt={edge.at === "left" ? x1 : x2}
				orient={edge.at}
				hideLine={true}
				/>;
		});
		var line = null;
		if (this.props.edges.length > 0) {
			line = <line className="react-stockcharts-cross-hair" opacity={0.3} stroke="black"
					x1={x1} y1={this.props.mouseXY[1]}
					x2={x2} y2={this.props.mouseXY[1]} />;
		}
		return (
			<g className={"crosshair "}>
				{line}
				{edges}
				<EdgeCoordinate
					type="vertical"
					className="horizontal"
					show={true}
					x1={this.props.mouseXY[0]} y1={0}
					x2={this.props.mouseXY[0]} y2={this.props.height}
					coordinate={this.props.xDisplayValue}
					edgeAt={this.props.height}
					orient="bottom"
					/>
			</g>
		);
	}
}

CrossHair.propTypes = {
	yAxisPad: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
	width: React.PropTypes.number.isRequired,
	mouseXY: React.PropTypes.array.isRequired,
	xDisplayValue: React.PropTypes.string.isRequired,
	edges: React.PropTypes.array.isRequired
};

CrossHair.defaultProps = {
	namespace: "ReStock.CrossHair",
	yAxisPad: 5
};

module.exports = CrossHair;
