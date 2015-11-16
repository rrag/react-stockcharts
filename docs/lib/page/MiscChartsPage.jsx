'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');
var TypeChooser = require("src/").helper.TypeChooser;

var AreaChartWithZoomPan = require('lib/charts/AreaChartWithZoomPan');

var MiscChartsPage = React.createClass({
	statics: {
		title: 'Misc Charts'
	},
	render() {
		return (
			<ContentSection title={MiscChartsPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/SINGLE-VALUE-TOOLTIP')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => <AreaChartWithZoomPan data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = MiscChartsPage;
