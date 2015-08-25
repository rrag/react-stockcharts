'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');
var TypeChooser = require("src/").helper.TypeChooser;

var CandleStickChartWithBollingerBandOverlay = require('lib/charts/CandleStickChartWithBollingerBandOverlay');

var BollingerBandOverlayPage = React.createClass({
	statics: {
		title: 'Overlays - Bollinger Band'
	},
	render() {
		return (
			<ContentSection title={BollingerBandOverlayPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser type="hybrid">
							{(type) => <CandleStickChartWithBollingerBandOverlay data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/BOLLINGER-BAND-OVERLAY')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = BollingerBandOverlayPage;
