'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');

var CandleStickChartWithMA = require('lib/charts/CandleStickChartWithMA');

var OverlayPage = React.createClass({
	statics: {
		title: 'Overlay'
	},
	render() {
		return (
			<ContentSection title={OverlayPage.title}>
				<Row>
					<Section colSpan={2}>
						<CandleStickChartWithMA data={this.props.someData}/>
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

module.exports = OverlayPage;
