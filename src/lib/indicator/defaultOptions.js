export const BollingerBand = {
	period: 20,
	source: "close", // "high", "low", "open", "close"
	multiplier: 2,
	movingAverageType: "sma"
};

export const ATR = {
	period: 14,
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
		D: "#00F300",
		K: "#FF0000",
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
	source: "close", // "high", "low", "open", "close"
	period: 10,
};

export const SMA = {
	source: "close", // "high", "low", "open", "close"
	period: 10,
};
