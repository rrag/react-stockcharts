'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');

var CreatingCustomChartSeriesPage = React.createClass({
	statics: {
		title: 'Custom - Create XXXSeries'
	},
	render() {
		return (
			<ContentSection title={CreatingCustomChartSeriesPage.title}>
				<Row>
					<Section  colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/CREATE-CUSTOM-SERIES')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = CreatingCustomChartSeriesPage;
