"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var BollingerBand = exports.BollingerBand = {
	windowSize: 20,
	// source: d => d.close, // "high", "low", "open", "close"
	sourcePath: "close",
	multiplier: 2,
	movingAverageType: "sma"
};

var ATR = exports.ATR = {
	windowSize: 14
};

var ForceIndex = exports.ForceIndex = {
	sourcePath: "close", // "high", "low", "open", "close"
	volumePath: "volume"
};
var SmoothedForceIndex = exports.SmoothedForceIndex = {
	sourcePath: "close", // "high", "low", "open", "close"
	volumePath: "volume",
	smoothingType: "ema",
	smoothingWindow: 13
};
var Change = exports.Change = {
	sourcePath: "close" // "high", "low", "open", "close"
};
var Compare = exports.Compare = {
	basePath: "close",
	mainKeys: ["open", "high", "low", "close"],
	compareKeys: []
};

var ElderRay = exports.ElderRay = {
	windowSize: 13,
	// source: d => d.close, // "high", "low", "open", "close"
	sourcePath: "close", // "high", "low", "open", "close"
	movingAverageType: "sma"
};

var ElderImpulse = exports.ElderImpulse = {
	sourcePath: "close" // "high", "low", "open", "close"
};

var SAR = exports.SAR = {
	accelerationFactor: 0.02,
	maxAccelerationFactor: 0.2
};

var MACD = exports.MACD = {
	fast: 12,
	slow: 26,
	signal: 9,
	// source: d => d.close, // "high", "low", "open", "close"
	sourcePath: "close"
};

var FullStochasticOscillator = exports.FullStochasticOscillator = {
	windowSize: 12,
	kWindowSize: 3,
	dWindowSize: 3
};

var RSI = exports.RSI = {
	windowSize: 14,
	// source: d => d.close, // "high", "low", "open", "close"
	sourcePath: "close" // "high", "low", "open", "close"
};

var EMA = exports.EMA = {
	// source: d => d.close, // "high", "low", "open", "close"
	sourcePath: "close",
	windowSize: 10
};

var SMA = exports.SMA = {
	// source: d => d.close, // "high", "low", "open", "close"
	sourcePath: "close",
	windowSize: 10
};

var WMA = exports.WMA = {
	// source: d => d.close, // "high", "low", "open", "close"
	sourcePath: "close",
	windowSize: 10
};

var TMA = exports.TMA = {
	// source: d => d.close, // "high", "low", "open", "close"
	sourcePath: "close",
	windowSize: 10
};

var Kagi = exports.Kagi = {
	reversalType: "ATR", // "ATR", "FIXED"
	windowSize: 14,
	reversal: 2,
	sourcePath: "close" // "high", "low", "open", "close"
	/* dateAccessor: d => d.date,
 dateMutator: (d, date) => { d.date = date; }, */
};

var Renko = exports.Renko = {
	reversalType: "ATR", // "ATR", "FIXED"
	windowSize: 14,
	fixedBrickSize: 2,
	sourcePath: "high/low" // "close", "high/low"
	/* source: d => ({ high: d.high, low: d.low }),
 dateAccessor: d => d.date,
 dateMutator: (d, date) => { d.date = date; }, */
};

var PointAndFigure = exports.PointAndFigure = {
	boxSize: 0.5,
	reversal: 3,
	sourcePath: "high/low" // "close", "high/low"

	/* source: d => ({ high: d.high, low: d.low }), // "close", "hi/lo"
 dateAccessor: d => d.date,
 dateMutator: (d, date) => { d.date = date; }, */
};
//# sourceMappingURL=defaultOptionsForComputation.js.map