'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');

var CandleStickChartWithMA = require('lib/charts/CandleStickChartWithMA');

var MAOverlayPage = React.createClass({
	statics: {
		title: 'Overlays - Moving Average'
	},
	render() {
		return (
			<ContentSection title={MAOverlayPage.title}>
				<Row>
					<Section colSpan={2}>
						<CandleStickChartWithMA data={this.props.someData} type="svg" />
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/MOVING-AVERAGE-OVERLAY')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = MAOverlayPage;
