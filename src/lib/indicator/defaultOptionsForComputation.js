"use strict";

export const BollingerBand = {
	period: 20,
	// source: d => d.close, // "high", "low", "open", "close"
	sourcePath: "close",
	multiplier: 2,
	movingAverageType: "sma"
};

export const ATR = {
	period: 14,
};

export const ForceIndex = {
	sourcePath: "close", // "high", "low", "open", "close"
};

export const ElderRay = {
	period: 13,
	// source: d => d.close, // "high", "low", "open", "close"
	sourcePath: "close", // "high", "low", "open", "close"
	movingAverageType: "sma",
};

export const ElderImpulse = {
	sourcePath: "close", // "high", "low", "open", "close"
};

export const MACD = {
	fast: 12,
	slow: 26,
	signal: 9,
	// source: d => d.close, // "high", "low", "open", "close"
	sourcePath: "close",
	fill: {
		divergence: "#4682B4"
	},
	stroke: {
		macd: "#FF0000",
		signal: "#00F300",
	},
};

export const FullStochasticOscillator = {
	period: 12,
	K: 3,
	D: 3,
};

export const RSI = {
	period: 14,
	// source: d => d.close, // "high", "low", "open", "close"
	sourcePath: "close", // "high", "low", "open", "close"
};

export const EMA = {
	// source: d => d.close, // "high", "low", "open", "close"
	sourcePath: "close",
	period: 10,
};

export const SMA = {
	// source: d => d.close, // "high", "low", "open", "close"
	sourcePath: "close",
	period: 10,
};

export const Kagi = {
	reversalType: "ATR", // "ATR", "FIXED"
	period: 14,
	reversal: 2,
	sourcePath: "close", // "high", "low", "open", "close"
	dateAccessor: d => d.date,
	dateMutator: (d, date) => { d.date = date; },
	indexMutator: (d, idx) => { d.idx = idx; },
};

export const Renko = {
	reversalType: "ATR", // "ATR", "FIXED"
	period: 14,
	fixedBrickSize: 2,
	source: d => ({ high: d.high, low: d.low }), // "close", "hi/lo"
	dateAccessor: d => d.date,
	dateMutator: (d, date) => { d.date = date; },
	indexMutator: (d, idx) => { d.idx = idx; },
	indexAccessor: d => d.idx,
};

export const PointAndFigure = {
	boxSize: 0.5,
	reversal: 3,
	source: d => ({ high: d.high, low: d.low }), // "close", "hi/lo"
	dateAccessor: d => d.date,
	dateMutator: (d, date) => { d.date = date; },
	indexMutator: (d, idx) => { d.idx = idx; },
	indexAccessor: d => d.idx,
};
