"use strict";

import React from "react";
import { helper } from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithZoomPan from "lib/charts/CandleStickChartWithZoomPan";

var { TypeChooser } = helper;

class ZoomAndPanPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			disableMouseMoveEvent: false,
			disablePanEvent: false,
			disableZoomEvent: false
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
			disableMouseMoveEvent,
			disablePanEvent,
			disableZoomEvent
		} = this.state;

		return (
			<ContentSection title={ZoomAndPanPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => (<CandleStickChartWithZoomPan
								ref={this.saveNode}
								data={this.props.someData}
								disableMouseMoveEvent={disableMouseMoveEvent}
								disablePanEvent={disablePanEvent}
								disableZoomEvent={disableZoomEvent}
								type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<div style={{ textAlign: "center" }}>
						<button type="button" onClick={this.toggleState.bind(this, "disableMouseMoveEvent")}>
							{disableMouseMoveEvent ? "Enable" : "Disable"} Mouse Moves
						</button>
						{" "}
						<button type="button" onClick={this.toggleState.bind(this, "disablePanEvent")}>
							{disablePanEvent ? "Enable" : "Disable"} Pan
						</button>
						{" "}
						<button type="button" onClick={this.toggleState.bind(this, "disableZoomEvent")}>
							{disableZoomEvent ? "Enable" : "Disable"} Zoom
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
