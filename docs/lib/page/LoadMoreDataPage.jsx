"use strict";

import React from "react";
import { TypeChooser } from "react-stockcharts/lib/helper";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartPanToLoadMore from "lib/charts/CandleStickChartPanToLoadMore";

class LoadMoreDataPage extends React.Component {
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
}

LoadMoreDataPage.title = "Load more data on pan";

export default LoadMoreDataPage;
