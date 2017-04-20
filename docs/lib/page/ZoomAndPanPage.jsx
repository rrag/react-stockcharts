"use strict";

import React from "react";
import { TypeChooser } from "react-stockcharts/lib/helper";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithZoomPan from "lib/charts/CandleStickChartWithZoomPan";

class ZoomAndPanPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mouseMoveEvent: true,
			panEvent: true,
			zoomEvent: true,
			clamp: false,
		};
		this.toggleState = this.toggleState.bind(this);
		this.saveNode = this.saveNode.bind(this);
		this.resetYDomain = this.resetYDomain.bind(this);
	}
	saveNode(node) {
		this.node = node;
	}
	resetYDomain() {
		this.node.getWrappedInstance().resetYDomain();
	}
	toggleState(property) {
		const value = this.state[property];
		this.setState({
			[property]: !value
		});
	}
	render() {
		const {
			mouseMoveEvent,
			panEvent,
			zoomEvent,
			clamp,
		} = this.state;

		return (
			<ContentSection title={ZoomAndPanPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => (<CandleStickChartWithZoomPan
								ref={this.saveNode}
								data={this.props.lotsOfData}
								mouseMoveEvent={mouseMoveEvent}
								panEvent={panEvent}
								zoomEvent={zoomEvent}
								clamp={clamp}
								type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<div style={{ textAlign: "center" }}>
						<button type="button" onClick={this.toggleState.bind(this, "mouseMoveEvent")}>
							{mouseMoveEvent ? "Disable" : "Enable"} Mouse Moves
						</button>
						{" "}
						<button type="button" onClick={this.toggleState.bind(this, "panEvent")}>
							{panEvent ? "Disable" : "Enable"} Pan
						</button>
						{" "}
						<button type="button" onClick={this.toggleState.bind(this, "zoomEvent")}>
							{zoomEvent ? "Disable" : "Enable"} Zoom
						</button>
						{" "}
						<button type="button" onClick={this.toggleState.bind(this, "clamp")}>
							{clamp ? "Disable" : "Enable"} Clamp
						</button>
						{" "}
						<button type="button" onClick={this.resetYDomain}>
							Reset y domain
						</button>
					</div>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/ZOOM-AND-PAN") }}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

ZoomAndPanPage.title = "Zoom and Pan";


export default ZoomAndPanPage;
