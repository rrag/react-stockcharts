'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');

var CandleStickChartWithEdge = require('lib/examples/CandleStickChartWithEdge');

var LotsOfDataPage = React.createClass({
	statics: {
		title: 'Lots of data'
	},
	render() {
		return (
			<ContentSection title={LotsOfDataPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/LOTS-OF-DATA')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2} className="react-stockchart">
						<CandleStickChartWithEdge  data={this.props.lotsOfData}/>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = LotsOfDataPage;
