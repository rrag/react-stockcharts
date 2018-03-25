

import React from "react";
import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickStockScaleChartWithVolumeBarV1 from "lib/charts/CandleStickStockScaleChartWithVolumeBarV1";
import CandleStickStockScaleChartWithVolumeBarV2 from "lib/charts/CandleStickStockScaleChartWithVolumeBarV2";
import CandleStickStockScaleChartWithVolumeBarV3 from "lib/charts/CandleStickStockScaleChartWithVolumeBarV3";

class VolumeBarPage extends React.Component {
	render() {
		return (
			<ContentSection title={VolumeBarPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/VOLUME-BAR-INTRO") }}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<CandleStickStockScaleChartWithVolumeBarV1 data={this.props.someData} type="svg" />
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/VOLUME-BAR") }}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<CandleStickStockScaleChartWithVolumeBarV2 data={this.props.someData} type="svg" />
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/VOLUME-BAR-Contd") }}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<CandleStickStockScaleChartWithVolumeBarV3 data={this.props.someData} type="svg" />
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/VOLUME-BAR-Contd2") }}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

VolumeBarPage.title = "Volume bar";

export default VolumeBarPage;
