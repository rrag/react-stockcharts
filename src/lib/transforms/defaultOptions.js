export const Kagi = {
	reversalType: "ATR", // "ATR", "FIXED"
	period: 14,
	reversal: 2,
	source: "close", // "high", "low", "open", "close"
};

export const Renko = {
	reversalType: "ATR", // "ATR", "FIXED"
	period: 14,
	fixedBrickSize: 2,
	source: "hi/lo", // "close", "hi/lo"
};

export const PointAndFigure = {
	boxSize: 0.5,
	reversal: 3,
	source: "hi/lo", // "close", "hi/lo"
};
