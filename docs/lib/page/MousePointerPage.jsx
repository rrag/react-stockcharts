'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');

var CandleStickChartWithCHMousePointer = require('lib/charts/CandleStickChartWithCHMousePointer');

var MousePointerPage = React.createClass({
	statics: {
		title: 'Mouse pointer'
	},
	render() {
		return (
			<ContentSection title={MousePointerPage.title}>
				<Row>
					<Section colSpan={2}>
						<CandleStickChartWithCHMousePointer data={this.props.someData} type="svg" />
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/MOUSEPOINTER')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = MousePointerPage;
