'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');

var AreaChart = require('lib/charts/AreaChart');
var AreaChartWithYPercent = require('lib/charts/AreaChartWithYPercent');

var OverviewPage = React.createClass({
	statics: {
		title: 'Area Chart'
	},
	render() {
		return (
			<ContentSection title={OverviewPage.title}>
				<Row>
					<Section colSpan={2}>
						<AreaChart data={this.props.someData} type="svg" />
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/AREACHART')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<AreaChartWithYPercent data={this.props.someData} type="svg" />
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = OverviewPage;
