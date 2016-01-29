"use strict";

export const BollingerBand = {
	period: 20,
	source: "close", // "high", "low", "open", "close"
	multiplier: 2,
	movingAverageType: "sma"
};

export const ATR = {
	period: 14,
}

export const ForceIndex = {
	source: "close", // "high", "low", "open", "close"
	volume: d => d.volume
}

export const ElderRay = {
	period: 13,
	source: "close", // "high", "low", "open", "close"
	movingAverageType: "ema",
	ohlc: (d) => ({ open: d.open, high: d.high, low: d.low, close: d.close }),
}

export const ElderImpulse = {
	stroke: {
		up: "#6BA583",
		down: "#FF0000",
		neutral: "#0000FF",
	}
}

export const MACD = {
	fast: 12,
	slow: 26,
	signal: 9,
	source: "close", // "high", "low", "open", "close"
	fill: {
		histogram: "#4682B4"
	},
	stroke: {
		MACDLine: "#FF0000",
		signalLine: "#00F300",
	},
};

export const FullStochasticOscillator = {
	period: 12,
	K: 3,
	D: 3,
	ohlc: (d) => ({ open: d.open, high: d.high, low: d.low, close: d.close }),
	stroke: {
		D: "#17becf",
		K: "#ff7f0e",
	},
	overSold: 80,
	overBought: 20,
};

export const RSI = {
	period: 14,
	source: "close", // "high", "low", "open", "close"
	overSold: 70,
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
