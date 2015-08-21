"use strict";

// common components
import ChartCanvas from "./lib/ChartCanvas";
import Chart from "./lib/Chart";
import DataSeries from "./lib/DataSeries";
import OverlaySeries from "./lib/OverlaySeries";

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

const version = "0.2.0-alpha-4";

export default {
	ChartCanvas,
	Chart,
	DataSeries,
	OverlaySeries,
	EventCapture,
	series,
	coordinates,
	indicator,
	transforms,
	axes,
	tooltip,
	helper,
	version
};

