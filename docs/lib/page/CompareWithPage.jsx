'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');

var CandleStickChartWithCompare = require('lib/charts/CandleStickChartWithCompare');

var CompareWithPage = React.createClass({
	statics: {
		title: 'Compare'
	},
	render() {
		return (
			<ContentSection title={CompareWithPage.title}>
				<Row>
					<Section colSpan={2}>
						<CandleStickChartWithCompare data={this.props.compareData}/>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/COMPARE-WITH')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = CompareWithPage;
