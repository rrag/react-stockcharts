"use strict";

// common components
import ChartCanvas from "./lib/ChartCanvas";
import Chart from "./lib/Chart";
import DataSeries from "./lib/DataSeries";
import BackgroundText from "./lib/BackgroundText";

// interaction components
import EventCapture from "./lib/EventCapture";

// chart types & Series
import series from "./lib/series";

import coordinates from "./lib/coordinates";
import indicator from "./lib/indicator";

import transforms from "./lib/transforms";
import axes from "./lib/axes";
import tooltip from "./lib/tooltip";
import helper from "./lib/helper";

import interactive from "./lib/interactive";
import Utils from "./lib/utils/utils";

const version = "0.3.0";

export default {
	ChartCanvas,
	Chart,
	DataSeries,
	EventCapture,
	BackgroundText,
	series,
	coordinates,
	indicator,
	transforms,
	axes,
	tooltip,
	helper,
	interactive,
	version,
	Utils
};

