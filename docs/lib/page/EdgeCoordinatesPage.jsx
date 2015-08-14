'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');

var CandleStickChartWithEdge = require('lib/charts/CandleStickChartWithEdge');

var EdgeCoordinatesPage = React.createClass({
	statics: {
		title: 'Edge coordinate'
	},
	render() {
		return (
			<ContentSection title={EdgeCoordinatesPage.title}>
				<Row>
					<Section colSpan={2}>
						<CandleStickChartWithEdge  data={this.props.someData} type="svg"/>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/EDGE-COORDINATE')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = EdgeCoordinatesPage;
