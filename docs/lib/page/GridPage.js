

import React from "react";
import { TypeChooser } from "react-stockcharts/lib/helper";

import {
	curveLinear,
	curveStep,
	curveStepBefore,
	curveStepAfter,
	curveBasis,
	curveCardinal,
	curveMonotoneX,
	curveCatmullRom,
} from "d3-shape";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import LineAndScatterChartGrid from "lib/charts/LineAndScatterChartGrid";

const options = {
	none: undefined,
	curveLinear: curveLinear,
	curveStep: curveStep,
	curveStepBefore: curveStepBefore,
	curveStepAfter: curveStepAfter,
	curveBasis: curveBasis,
	curveCardinal: curveCardinal,
	curveMonotoneX: curveMonotoneX,
	curveCatmullRom: curveCatmullRom,
};

class GridPage extends React.Component {
	constructor(params) {
		super(params);
		this.handleGridChange = this.handleGridChange.bind(this);
		this.handleGridOpacityChange = this.handleGridOpacityChange.bind(this);
		this.handleGridWidthChange = this.handleGridWidthChange.bind(this);
		this.handleInterpolationChange = this.handleInterpolationChange.bind(this);
		this.handleSeriesTypeChange = this.handleSeriesTypeChange.bind(this);
		this.state = {
			tickStrokeDasharray: "Solid",
			tickStrokeOpacity: 0.2,
			tickStrokeWidth: 1,
			interpolation: "none",
			seriesType: "line",
		};
	}
	handleGridChange(e) {
		this.setState({
			tickStrokeDasharray: e.target.value
		});
	}
	handleGridOpacityChange(e) {
		this.setState({
			tickStrokeOpacity: parseFloat(e.target.value)
		});
	}
	handleInterpolationChange(e) {
		this.setState({
			interpolation: e.target.value
		});
	}
	handleGridWidthChange(e) {
		this.setState({
			tickStrokeWidth: parseInt(e.target.value)
		});
	}
	handleSeriesTypeChange(e) {
		this.setState({
			seriesType: e.target.value
		});
	}
	render() {
		const {
			tickStrokeDasharray,
			tickStrokeOpacity,
			tickStrokeWidth,
			interpolation,
			seriesType,
		} = this.state;

		return (
			<ContentSection title={GridPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{type => (
								<LineAndScatterChartGrid
									gridProps={{
										tickStrokeOpacity,
										tickStrokeDasharray,
										tickStrokeWidth
									}}
									interpolation={options[interpolation]}
									seriesType={seriesType}
									data={this.props.someData}
									type={type}
								/>
							)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						Interpolation:
						<select onChange={this.handleInterpolationChange} value={interpolation}>
							{Object.keys(options)
								.map((each, idx) => <option key={idx} value={each}>{each}</option>)}
						</select>
						<hr />
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						Grid style:
						<select onChange={this.handleGridChange} value={tickStrokeDasharray}>
							<option value="Solid">Solid</option>
							<option value="ShortDash">ShortDash</option>
							<option value="ShortDot">ShortDot</option>
							<option value="ShortDashDot">ShortDashDot</option>
							<option value="ShortDashDotDot">ShortDashDotDot</option>
							<option value="Dot">Dot</option>
							<option value="Dash">Dash</option>
							<option value="LongDash">LongDash</option>
							<option value="DashDot">DashDot</option>
							<option value="LongDashDot">LongDashDot</option>
							<option value="LongDashDotDot">LongDashDotDot</option>
						</select>
						{" "}
						Stroke opacity:
						<select onChange={this.handleGridOpacityChange} value={tickStrokeOpacity}>
							<option value="1">1</option>
							<option value="0.9">0.9</option>
							<option value="0.8">0.8</option>
							<option value="0.7">0.7</option>
							<option value="0.6">0.6</option>
							<option value="0.5">0.5</option>
							<option value="0.4">0.4</option>
							<option value="0.3">0.3</option>
							<option value="0.2">0.2</option>
							<option value="0.1">0.1</option>
						</select>
						{" "}
						Stroke width:
						<input type="number" value={tickStrokeWidth} onChange={this.handleGridWidthChange} />
						{" "}
						Series:
						<select onChange={this.handleSeriesTypeChange} value={seriesType}>
							<option value="line">Line</option>
							<option value="area">Area</option>
						</select>
						<hr />
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/GRID") }}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

GridPage.title = "Grid";

export default GridPage;
