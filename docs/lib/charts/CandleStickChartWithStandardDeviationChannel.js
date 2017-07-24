import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import { CandlestickSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	EdgeIndicator,
	MouseCoordinateY,
	MouseCoordinateX
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { OHLCTooltip } from "react-stockcharts/lib/tooltip";
import { fitWidth } from "react-stockcharts/lib/helper";
import { StandardDeviationChannel } from "react-stockcharts/lib/interactive";
import { last } from "react-stockcharts/lib/utils";

class CandleStickChartWithStandardDeviationChannel extends React.Component {
	constructor(props) {
		super(props);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onDrawComplete = this.onDrawComplete.bind(this);
		this.saveInteractiveNode = this.saveInteractiveNode.bind(this);
		this.saveCanvasNode = this.saveCanvasNode.bind(this);

		this.state = {
			enableInteractiveObject: true,
			channels: []
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
	onDrawComplete(channels) {
		// this gets called on
		// 1. draw complete of drawing object
		// 2. drag complete of drawing object
		this.setState({
			enableInteractiveObject: false,
			channels
		});
	}
	onKeyPress(e) {
		const keyCode = e.which;
		console.log(keyCode);
		switch (keyCode) {
		case 46: {
			// DEL
			this.setState({
				channels: this.state.channels.slice(
					0,
					this.state.channels.length - 2
				)
			});
			break;
		}
		case 27: {
			// ESC
			this.node.terminate();
			this.canvasNode.cancelDrag();
			this.setState({
				enableInteractiveObject: false
			});
			break;
		}
		case 68: // D - Draw drawing object
		case 69: {
				// E - Enable drawing object
			this.setState({
				enableInteractiveObject: true
			});
			break;
		}
		}
	}
	render() {
		const { type, data: initialData, width, ratio } = this.props;
		const { channels } = this.state;

		const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
			d => d.date
		);
		const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
			initialData
		);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 150)]);
		const xExtents = [start, end];

		return (
			<ChartCanvas ref={this.saveCanvasNode}
				height={400}
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
				drawMode={this.state.enableInteractiveObject}
			>
				<Chart
					id={1}
					yExtents={[d => [d.high, d.low]]}
					padding={{ top: 10, bottom: 20 }}
				>

					<YAxis axisAt="right" orient="right" ticks={5} />
					<XAxis axisAt="bottom" orient="bottom" />

					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")}
					/>
					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")}
					/>
					<CandlestickSeries />

					<EdgeIndicator
						itemType="last"
						orient="right"
						edgeAt="right"
						yAccessor={d => d.close}
						fill={d => (d.close > d.open ? "#6BA583" : "#FF0000")}
					/>

					<OHLCTooltip origin={[-40, 0]} />

					<StandardDeviationChannel
						ref={this.saveInteractiveNode}
						enabled={this.state.enableInteractiveObject}
						onStart={() => console.log("START")}
						onComplete={this.onDrawComplete}
						channels={channels}
					/>
				</Chart>
				<CrossHairCursor />
			</ChartCanvas>
		);
	}
}

CandleStickChartWithStandardDeviationChannel.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired
};

CandleStickChartWithStandardDeviationChannel.defaultProps = {
	type: "svg"
};

CandleStickChartWithStandardDeviationChannel = fitWidth(
	CandleStickChartWithStandardDeviationChannel
);

export default CandleStickChartWithStandardDeviationChannel;
