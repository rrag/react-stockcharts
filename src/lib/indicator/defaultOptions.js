"use strict";

export const BollingerBand = {
	period: 20,
	source: d => d.close, // "high", "low", "open", "close"
	multiplier: 2,
	movingAverageType: "sma"
};

export const ATR = {
	period: 14,
	source: d => ({ open: d.open, high: d.high, low: d.low, close: d.close }),
};

export const ForceIndex = {
	close: d => d.close, // "high", "low", "open", "close"
	volume: d => d.volume
};

export const ElderRay = {
	period: 13,
	source: d => d.close, // "high", "low", "open", "close"
	movingAverageType: "sma",
	ohlc: d => ({ open: d.open, high: d.high, low: d.low, close: d.close }),
};

export const ElderImpulse = {
	stroke: {
		up: "#6BA583",
		down: "#FF0000",
		neutral: "#0000FF",
	}
};

export const MACD = {
	fast: 12,
	slow: 26,
	signal: 9,
	source: d => d.close, // "high", "low", "open", "close"
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
	source: (d) => ({ open: d.open, high: d.high, low: d.low, close: d.close }),
	stroke: {
		D: "#17becf",
		K: "#ff7f0e",
	},
	overSold: 80,
	middle: 50,
	overBought: 20,
};

export const RSI = {
	period: 14,
	source: d => d.close, // "high", "low", "open", "close"
	overSold: 70,
	middle: 50,
	overBought: 30,
};

export const EMA = {
	source: d => d.close, // "high", "low", "open", "close"
	period: 10,
};

export const SMA = {
	source: d => d.close, // "high", "low", "open", "close"
	period: 10,
};

export const Kagi = {
	reversalType: "ATR", // "ATR", "FIXED"
	period: 14,
	reversal: 2,
	source: d => d.close, // "high", "low", "open", "close"
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
