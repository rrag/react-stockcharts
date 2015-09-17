'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');
var TypeChooser = require("src/").helper.TypeChooser;

var CandleStickChartWithUpdatingData = require('lib/charts/CandleStickChartWithUpdatingData');

var UpdatingDataPage = React.createClass({
	statics: {
		title: 'Updating Data'
	},
	render() {
		return (
			<ContentSection title={UpdatingDataPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => <CandleStickChartWithUpdatingData data={this.props.lotsOfData.slice(200)} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = UpdatingDataPage;
