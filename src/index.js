"use strict";

// common components
import ChartCanvas from "./lib/ChartCanvas";
import DataTransform from "./lib/DataTransform";
import Chart from "./lib/Chart";
import DataSeries from "./lib/DataSeries";
import OverlaySeries from "./lib/OverlaySeries";

// chart types & Series
import AreaSeries from "./lib/AreaSeries";
import LineSeries from "./lib/LineSeries";
import CompareSeries from "./lib/CompareSeries";
import CandlestickSeries from "./lib/CandlestickSeries";
import HistogramSeries from "./lib/HistogramSeries";
import KagiSeries from "./lib/KagiSeries";
import PointAndFigureSeries from "./lib/PointAndFigureSeries";
import RenkoSeries from "./lib/RenkoSeries";
import MACDSeries from "./lib/MACDSeries";

// interaction components
import EventCapture from "./lib/EventCapture";
import MouseCoordinates from "./lib/MouseCoordinates";
import CurrentCoordinate from "./lib/CurrentCoordinate";

// misc
import EdgeContainer from "./lib/EdgeContainer";
import EdgeIndicator from "./lib/EdgeIndicator";

import indicator from "./lib/indicator";

import transforms from "./lib/transforms";
import axes from "./lib/axes";
import tooltip from "./lib/tooltip";
import helper from "./lib/helper";

const version = "0.2.0-alpha";

export default {
	ChartCanvas,
	DataTransform,
	Chart,
	DataSeries,
	OverlaySeries,
	AreaSeries,
	LineSeries,
	CompareSeries,
	CandlestickSeries,
	HistogramSeries,
	KagiSeries,
	PointAndFigureSeries,
	RenkoSeries,
	MACDSeries,
	EventCapture,
	MouseCoordinates,
	CurrentCoordinate,
	EdgeContainer,
	EdgeIndicator,
	indicator,
	transforms,
	axes,
	tooltip,
	helper,
	version
}

