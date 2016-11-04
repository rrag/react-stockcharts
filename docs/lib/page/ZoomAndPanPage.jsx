'use strict';

import React from "react";
import { helper } from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithZoomPan from "lib/charts/CandleStickChartWithZoomPan";

var { TypeChooser } = helper;

var ZoomAndPanPage = React.createClass({
	statics: {
		title: 'Zoom and Pan'
	},
	getInitialState () {
		return {
			disableMouseMoveEvent: false,
			disablePanEvent: false,
			disableZoomEvent: false
		};
	},
	toggleState(property) {
		const value = this.state[property];
		this.setState({
			[property]: !value
		});
	},
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
						<TypeChooser ref="container">
							{(type) => (<CandleStickChartWithZoomPan
								data={this.props.someData}
								disableMouseMoveEvent={disableMouseMoveEvent}
								disablePanEvent={disablePanEvent}
								disableZoomEvent={disableZoomEvent}
								type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<div style={{ textAlign: 'center' }}>
						<button type="button" onClick={this.toggleState.bind(this, 'disableMouseMoveEvent')}>
							{disableMouseMoveEvent? 'Enable' : 'Disable'} Mouse Moves
						</button>
						{' '}
						<button type="button" onClick={this.toggleState.bind(this, 'disablePanEvent')}>
							{disablePanEvent? 'Enable' : 'Disable'} Pan
						</button>
						{' '}
						<button type="button" onClick={this.toggleState.bind(this, 'disableZoomEvent')}>
							{disableZoomEvent? 'Enable' : 'Disable'} Zoom
						</button>
					</div>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/ZOOM-AND-PAN')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default ZoomAndPanPage;
