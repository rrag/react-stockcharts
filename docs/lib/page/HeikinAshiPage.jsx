'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');

var HeikinAshiChart = require('lib/examples/HaikinAshi');

var HeikinAshiPage = React.createClass({
	statics: {
		title: 'Heikin Ashi'
	},
	render() {
		return (
			<ContentSection title={HeikinAshiPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/HEIKIN-ASHI')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2} className="react-stockchart">
						<HeikinAshiChart  data={this.props.someData} />
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = HeikinAshiPage;
