"use strict";

import React from "react";
import { TypeChooser } from "react-stockcharts/lib/helper";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithZoomPan from "lib/charts/CandleStickChartWithZoomPan";
import {
	mouseBasedZoomAnchor,
	lastVisibleItemBasedZoomAnchor,
	rightDomainBasedZoomAnchor,
} from "react-stockcharts/lib/utils/zoomBehavior";

import {
	Form,
	FormGroup,
	ControlLabel,
	FormControl,
	Col,
} from "react-bootstrap";

const zoomAnchor = {
	mouseBasedZoomAnchor,
	lastVisibleItemBasedZoomAnchor,
	rightDomainBasedZoomAnchor,
};

class ZoomAndPanPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mouseMoveEvent: true,
			panEvent: true,
			zoomEvent: true,
			clamp: false,
			zoomAnchor: "rightDomainBasedZoomAnchor",
		};
		this.toggleState = this.toggleState.bind(this);
		this.saveNode = this.saveNode.bind(this);
		this.resetYDomain = this.resetYDomain.bind(this);
		this.setZoomAnchor = this.setZoomAnchor.bind(this);
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
	setZoomAnchor(e) {
		this.setState({
			zoomAnchor: e.target.value
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
							{type => <CandleStickChartWithZoomPan
								ref={this.saveNode}
								data={this.props.lotsOfData}
								mouseMoveEvent={mouseMoveEvent}
								panEvent={panEvent}
								zoomEvent={zoomEvent}
								clamp={clamp}
								type={type}
								zoomAnchor={zoomAnchor[this.state.zoomAnchor]}
							/>}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Form horizontal>
						<FormGroup controlId="formControlsSelectMultiple">
							<Col componentClass={ControlLabel} sm={4}>
								Zoom anchor
							</Col>
							<Col sm={6}>
								<FormControl
									componentClass="select"
									value={this.state.zoomAnchor}
									onChange={this.setZoomAnchor}
								>
									<option value="mouseBasedZoomAnchor">Mouse position</option>
									<option value="lastVisibleItemBasedZoomAnchor">Last visible candle</option>
									<option value="rightDomainBasedZoomAnchor">Right extreme point</option>
								</FormControl>
							</Col>
						</FormGroup>
					</Form>
				</Row>
				<Row>
					<div style={{ textAlign: "center" }}>
						<button type="button" onClick={this.toggleState.bind(this, "mouseMoveEvent")}>
							{mouseMoveEvent ? "Disable" : "Enable"} Mouse Moves
						</button> <button type="button" onClick={this.toggleState.bind(this, "panEvent")}>
							{panEvent ? "Disable" : "Enable"} Pan
						</button> <button type="button" onClick={this.toggleState.bind(this, "zoomEvent")}>
							{zoomEvent ? "Disable" : "Enable"} Zoom
						</button> <button type="button" onClick={this.toggleState.bind(this, "clamp")}>
							{clamp ? "Disable" : "Enable"} Clamp
						</button> <button type="button" onClick={this.resetYDomain}>
							Reset y domain
						</button>
					</div>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/ZOOM-AND-PAN") }} />
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

ZoomAndPanPage.title = "Zoom and Pan";


export default ZoomAndPanPage;
