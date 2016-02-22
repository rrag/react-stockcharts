"use strict";

// common components
import ChartCanvas from "./lib/ChartCanvas";
import Chart from "./lib/Chart";

import BackgroundText from "./lib/BackgroundText";

// interaction components
import EventCapture from "./lib/EventCapture";

// chart types & Series
import * as series from "./lib/series";
import * as scale from "./lib/scale";

import * as coordinates from "./lib/coordinates";
import * as indicator from "./lib/indicator";

import * as transforms from "./lib/transforms";
import * as axes from "./lib/axes";
import * as tooltip from "./lib/tooltip";
import * as helper from "./lib/helper";

import * as interactive from "./lib/interactive";
import * as Utils from "./lib/utils";

const version = "0.3.1";

export {
	ChartCanvas,
	Chart,
	EventCapture,
	BackgroundText,
	series,
	coordinates,
	indicator,
	transforms,
	axes,
	scale,
	tooltip,
	helper,
	interactive,
	version,
	Utils
};

