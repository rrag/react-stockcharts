'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');
var TypeChooser = require("src/").helper.TypeChooser;

var CandleStickChartWithUpdatingData = require('lib/charts/CandleStickChartWithUpdatingData');
var KagiWithUpdatingData = require('lib/charts/KagiWithUpdatingData');
var PointAndFigureWithUpdatingData = require('lib/charts/PointAndFigureWithUpdatingData');
var RenkoWithUpdatingData = require('lib/charts/RenkoWithUpdatingData');

var UpdatingDataPage = React.createClass({
	statics: {
		title: 'Updating Data'
	},
	render() {
		return (
			<ContentSection title={UpdatingDataPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/UPDATING-DATA')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => <CandleStickChartWithUpdatingData data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => <KagiWithUpdatingData data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => <PointAndFigureWithUpdatingData data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => <RenkoWithUpdatingData data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = UpdatingDataPage;
