
import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
	BarSeries,
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
import {
	OHLCTooltip,
	MovingAverageTooltip,
	MACDTooltip,
} from "react-stockcharts/lib/tooltip";
import { ema, macd } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import { EquidistantChannel, DrawingObjectSelector } from "react-stockcharts/lib/interactive";
import { last, toObject } from "react-stockcharts/lib/utils";
import {
	saveInteractiveNodes,
	getInteractiveNodes,
} from "./interactiveutils";

const macdAppearance = {
	stroke: {
		macd: "#FF0000",
		signal: "#00F300",
	},
	fill: {
		divergence: "#4682B4"
	},
};

class CandleStickChartWithEquidistantChannel extends React.Component {
	constructor(props) {
		super(props);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onDrawComplete = this.onDrawComplete.bind(this);
		this.saveInteractiveNode = this.saveInteractiveNode.bind(this);
		this.saveCanvasNode = this.saveCanvasNode.bind(this);
		this.handleSelection = this.handleSelection.bind(this);

		this.saveInteractiveNodes = saveInteractiveNodes.bind(this);
		this.getInteractiveNodes = getInteractiveNodes.bind(this);

		this.state = {
			enableInteractiveObject: true,
			channels_1: [],
			channels_3: [],
		};
	}
	saveInteractiveNode(node) {
		this.node = node;
	}
	saveCanvasNode(node) {
		this.canvasNode = node;
	}
	componentDidMount() {
		document.addEventListener("keyup", this.onKeyPress);
	}
	componentWillUnmount() {
		document.removeEventListener("keyup", this.onKeyPress);
	}
	handleSelection(interactives) {
		const state = toObject(interactives, each => {
			return [
				`channels_${each.chartId}`,
				each.objects,
			];
		});
		this.setState(state);
	}
	onDrawComplete(channels_1) {
		// this gets called on
		// 1. draw complete of drawing object
		// 2. drag complete of drawing object
		this.setState({
			enableInteractiveObject: false,
			channels_1
		});
	}
	onKeyPress(e) {
		const keyCode = e.which;
		console.log(keyCode);
		switch (keyCode) {
		case 46: { // DEL

			const channels_1 = this.state.channels_1
				.filter(each => !each.selected);
			const channels_3 = this.state.channels_3
				.filter(each => !each.selected);

			this.canvasNode.cancelDrag();
			this.setState({
				channels_1,
				channels_3,
			});
			break;
		}
		case 27: { // ESC
			this.node.terminate();
			this.canvasNode.cancelDrag();

			this.setState({
				enableInteractiveObject: false
			});
			break;
		}
		case 68:   // D - Draw drawing object
		case 69: { // E - Enable drawing object
			this.setState({
				enableInteractiveObject: true
			});
			break;
		}
		}
	}
	render() {
		const ema26 = ema()
			.id(0)
			.options({ windowSize: 26 })
			.merge((d, c) => { d.ema26 = c; })
			.accessor(d => d.ema26);

		const ema12 = ema()
			.id(1)
			.options({ windowSize: 12 })
			.merge((d, c) => {d.ema12 = c;})
			.accessor(d => d.ema12);

		const macdCalculator = macd()
			.options({
				fast: 12,
				slow: 26,
				signal: 9,
			})
			.merge((d, c) => {d.macd = c;})
			.accessor(d => d.macd);

		const { type, data: initialData, width, ratio } = this.props;
		const { channels_1, channels_3 } = this.state;

		const calculatedData = macdCalculator(ema12(ema26(initialData)));
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

		return (
			<ChartCanvas ref={this.saveCanvasNode}
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
					yExtents={[d => [d.high, d.low], ema26.accessor(), ema12.accessor()]}
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

					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>

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
					<EquidistantChannel
						ref={this.saveInteractiveNodes("EquidistantChannel", 1)}
						enabled={this.state.enableInteractiveObject}
						onStart={() => console.log("START")}
						onComplete={this.onDrawComplete}
						channels={channels_1}
					/>
				</Chart>
				<Chart id={2} height={150}
					yExtents={[d => d.volume]}
					origin={(w, h) => [0, h - 300]}
				>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".2s")}/>

					<MouseCoordinateY
						at="left"
						orient="left"
						displayFormat={format(".4s")} />

					<BarSeries yAccessor={d => d.volume} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"} />
				</Chart>
				<Chart id={3} height={150}
					yExtents={macdCalculator.accessor()}
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
				<DrawingObjectSelector
					enabled={!this.state.enableInteractiveObject}
					getInteractiveNodes={this.getInteractiveNodes}
					drawingObjectMap={{
						EquidistantChannel: "channels"
					}}
					onSelect={this.handleSelection}
				/>
			</ChartCanvas>
		);
	}
}

CandleStickChartWithEquidistantChannel.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithEquidistantChannel.defaultProps = {
	type: "svg",
};

CandleStickChartWithEquidistantChannel = fitWidth(CandleStickChartWithEquidistantChannel);

export default CandleStickChartWithEquidistantChannel;
