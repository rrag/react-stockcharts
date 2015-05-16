'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');

var AreaChart = require('lib/examples/AreaChart');
var AreaChartWithYPercent = require('lib/examples/AreaChartWithYPercent');

var OverviewPage = React.createClass({
	statics: {
		title: 'Area Chart'
	},
	render() {
		return (
			<ContentSection title={OverviewPage.title}>
				<Row>
					<Section colSpan={2} className="react-stockchart">
						<AreaChart data={this.props.someData} />
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/AREACHART')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2} className="react-stockchart">
						<AreaChartWithYPercent data={this.props.someData} />
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = OverviewPage;
