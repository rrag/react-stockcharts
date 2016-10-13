"use strict";

// common components
import ChartCanvas from "./lib/ChartCanvas";
import Chart from "./lib/Chart";

import GenericChartComponent, { getAxisCanvas } from "./lib/GenericChartComponent";
import GenericComponent from "./lib/GenericComponent";

import BackgroundText from "./lib/BackgroundText";

// chart types & Series
import * as series from "./lib/series";
import * as scale from "./lib/scale";

import * as coordinates from "./lib/coordinates";
import * as indicator from "./lib/indicator";
import * as algorithm from "./lib/algorithm";

import * as annotation from "./lib/annotation";

import * as axes from "./lib/axes";
import * as tooltip from "./lib/tooltip";
import * as helper from "./lib/helper";

import * as interactive from "./lib/interactive";
import * as utils from "./lib/utils";

const version = "0.6.0-beta.2";

export {
	ChartCanvas,
	Chart,
	GenericChartComponent,
	GenericComponent,
	BackgroundText,
	series,
	coordinates,
	indicator,
	algorithm,
	axes,
	scale,
	tooltip,
	annotation,
	helper,
	interactive,
	version,
	utils,
	getAxisCanvas,
};
