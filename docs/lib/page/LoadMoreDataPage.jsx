'use strict';

import React from "react";
import { helper } from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartPanToLoadMore from "lib/charts/CandleStickChartPanToLoadMore";
var { TypeChooser } = helper;


var LoadMoreDataPage = React.createClass({
	statics: {
		title: 'Load more data on pan'
	},
	render() {
		return (
			<ContentSection title={LoadMoreDataPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => <CandleStickChartPanToLoadMore data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default LoadMoreDataPage;
