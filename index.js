"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ChartCanvas = require("./lib/ChartCanvas");

Object.defineProperty(exports, "ChartCanvas", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ChartCanvas).default;
  }
});

var _Chart = require("./lib/Chart");

Object.defineProperty(exports, "Chart", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Chart).default;
  }
});

var _GenericChartComponent = require("./lib/GenericChartComponent");

Object.defineProperty(exports, "GenericChartComponent", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_GenericChartComponent).default;
  }
});

var _GenericComponent = require("./lib/GenericComponent");

Object.defineProperty(exports, "GenericComponent", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_GenericComponent).default;
  }
});

var _BackgroundText = require("./lib/BackgroundText");

Object.defineProperty(exports, "BackgroundText", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_BackgroundText).default;
  }
});

var _ZoomButtons = require("./lib/ZoomButtons");

Object.defineProperty(exports, "ZoomButtons", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ZoomButtons).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var version = exports.version = "0.7.8";

/*
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

*/

//# sourceMappingURL=index.js.map