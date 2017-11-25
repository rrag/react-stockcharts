
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import React from "react";
import PropTypes from "prop-types";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
	BarSeries,
	AreaSeries,
	CandlestickSeries,
	LineSeries,
	MACDSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	EdgeIndicator,
	CurrentCoordinate,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { OHLCTooltip, MovingAverageTooltip, MACDTooltip } from "react-stockcharts/lib/tooltip";
import { ema, sma, macd } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import { Brush } from "react-stockcharts/lib/interactive";
import { last, isDefined } from "react-stockcharts/lib/utils";
import {
	saveInteractiveNode,
} from "./interactiveutils";

const ema26 = ema()
	.id(0)
	.options({
		windowSize: 26,
	})
	.merge((d, c) => { d.ema26 = c; })
	.accessor(d => d.ema26);

const ema12 = ema()
	.id(1)
	.options({
		windowSize: 12,
	})
	.merge((d, c) => { d.ema12 = c; })
	.accessor(d => d.ema12);

const macdCalculator = macd()
	.options({
		fast: 12,
		slow: 26,
		signal: 9,
	})
	.merge((d, c) => { d.macd = c; })
	.accessor(d => d.macd);

const smaVolume50 = sma()
	.id(3)
	.options({
		windowSize: 10,
		sourcePath: "volume",
	})
	.merge((d, c) => { d.smaVolume50 = c; })
	.accessor(d => d.smaVolume50);

const BRUSH_TYPE = "2D"; // Valid values = "2D", "1D"
const macdAppearance = {
	stroke: {
		macd: "#FF0000",
		signal: "#00F300",
	},
	fill: {
		divergence: "#4682B4"
	},
};

class CandlestickChart extends React.Component {
	constructor(props) {
		super(props);
		this.handleBrush1 = this.handleBrush1.bind(this);
		this.handleBrush3 = this.handleBrush3.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.saveInteractiveNode = saveInteractiveNode.bind(this);

		const { data: initialData } = props;

		const calculatedData = macdCalculator(smaVolume50(ema12(ema26(initialData))));
		const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);
		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(calculatedData);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 150)]);
		const xExtents = [start, end];

		this.state = {
			data, xScale, xAccessor, displayXAccessor,
			xExtents,
			brushEnabled: true,
		};
	}
	componentDidMount() {
		document.addEventListener("keyup", this.onKeyPress);
	}
	componentWillUnmount() {
		document.removeEventListener("keyup", this.onKeyPress);
	}
	saveCanvasNode(node) {
		this.canvasNode = node;
	}
	onKeyPress(e) {
		const keyCode = e.which;
		console.log(keyCode);
		switch (keyCode) {
		case 27: { // ESC
			this.node_1.terminate();
			this.node_3.terminate();
			this.setState({
				brushEnabled: false,
			});
		}
		}
	}
	handleBrush1(brushCoords, moreProps) {
		const { start, end } = brushCoords;
		const left = Math.min(start.xValue, end.xValue);
		const right = Math.max(start.xValue, end.xValue);

		const low = Math.min(start.yValue, end.yValue);
		const high = Math.max(start.yValue, end.yValue);

		// uncomment the line below to make the brush to zoom
		this.setState({
			xExtents: [left, right],
			yExtents1: BRUSH_TYPE === "2D" ? [low, high] : this.state.yExtents1,
			brushEnabled: false,
		});
	}
	handleBrush3(brushCoords, moreProps) {
		const { start, end } = brushCoords;
		const left = Math.min(start.xValue, end.xValue);
		const right = Math.max(start.xValue, end.xValue);

		const low = Math.min(start.yValue, end.yValue);
		const high = Math.max(start.yValue, end.yValue);

		// uncomment the line below to make the brush to zoom
		this.setState({
			xExtents: [left, right],
			yExtents3: BRUSH_TYPE === "2D" ? [low, high] : this.state.yExtents3,
			brushEnabled: false,
		});
	}
	render() {
		const { type, width, ratio } = this.props;
		const { data, xExtents, xScale, xAccessor, displayXAccessor, brushEnabled } = this.state;

		const yExtents1 = isDefined(this.state.yExtents1)
			? this.state.yExtents1
			: [d => [d.high, d.low], ema26.accessor(), ema12.accessor()];

		const yExtents3 = isDefined(this.state.yExtents3)
			? this.state.yExtents3
			: macdCalculator.accessor();
		return (
			<ChartCanvas
				height={600}
				width={width}
				ratio={ratio}
				margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
				type={type}
				seriesName="MSFT"
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}
			>
				<Chart id={1} height={400}
					yPanEnabled={isDefined(this.state.yExtents1)}
					yExtents={yExtents1}
					padding={{ top: 10, bottom: 20 }}
				>
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
					<YAxis axisAt="right" orient="right" ticks={5} />

					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<CandlestickSeries />
					<LineSeries yAccessor={ema26.accessor()} stroke={ema26.stroke()}/>
					<LineSeries yAccessor={ema12.accessor()} stroke={ema12.stroke()}/>

					<CurrentCoordinate yAccessor={ema26.accessor()} fill={ema26.stroke()} />
					<CurrentCoordinate yAccessor={ema12.accessor()} fill={ema12.stroke()} />

					<EdgeIndicator
						itemType="last"
						orient="right"
						edgeAt="right"
						yAccessor={d => d.close}
						fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>

					<OHLCTooltip origin={[-40, 0]}/>

					<MovingAverageTooltip
						onClick={e => console.log(e)}
						origin={[-38, 15]}
						options={[
							{
								yAccessor: ema26.accessor(),
								type: ema26.type(),
								stroke: ema26.stroke(),
								windowSize: ema26.options().windowSize,
							},
							{
								yAccessor: ema12.accessor(),
								type: ema12.type(),
								stroke: ema12.stroke(),
								windowSize: ema12.options().windowSize,
							},
						]}
					/>
					<Brush
						ref={this.saveInteractiveNode(1)}
						enabled={brushEnabled}
						type={BRUSH_TYPE}
						onBrush={this.handleBrush1}/>
				</Chart>
				<Chart id={2} height={150}
					yExtents={[d => d.volume, smaVolume50.accessor()]}
					origin={(w, h) => [0, h - 300]}
				>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".2s")}/>

					<MouseCoordinateY
						at="left"
						orient="left"
						displayFormat={format(".4s")} />

					<BarSeries yAccessor={d => d.volume} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"} />
					<AreaSeries yAccessor={smaVolume50.accessor()} stroke={smaVolume50.stroke()} fill={smaVolume50.fill()}/>
				</Chart>
				<Chart id={3} height={150}
					yExtents={yExtents3}
					yPanEnabled={isDefined(this.state.yExtents3)}
					origin={(w, h) => [0, h - 150]} padding={{ top: 10, bottom: 10 }}
				>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={2} />
					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />
					<Brush
						ref={this.saveInteractiveNode(3)}
						enabled={brushEnabled}
						type={BRUSH_TYPE}
						onBrush={this.handleBrush3}/>
					<MACDSeries yAccessor={d => d.macd}
						{...macdAppearance} />
					<MACDTooltip
						origin={[-38, 15]}
						yAccessor={d => d.macd}
						options={macdCalculator.options()}
						appearance={macdAppearance}
					/>
				</Chart>
				<CrossHairCursor />
			</ChartCanvas>
		);
	}
}

CandlestickChart.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandlestickChart.defaultProps = {
	type: "svg",
};

const CandleStickChartWithBrush = fitWidth(CandlestickChart);

export default CandleStickChartWithBrush;
