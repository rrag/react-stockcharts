'use strict';

function sumOf(array, offset, length) {
	var sum = 0;
	for (var i = offset; i < offset + length; i++) {
		sum += array[i].trueRange;
	};
	return sum;
}

function calculateTR(rawData) {
	var prev = rawData[0];
	rawData
		.filter((d, idx) => idx > 0)
		.forEach(function(d, idx) {
			d.trueRange = Math.max(d.high - d.low,
				d.high - prev.close,
				d.low - prev.close)
			prev = rawData[idx];
		});
}

function calculateATR(rawData, period) {
	calculateTR(rawData);

	rawData.forEach(function(d, index) {
		if (index > period) { // trueRange starts from index 1 so ATR starts from period (not period -1)
			var num = (sumOf(rawData, index - period, period) / period)
			d["atr" + period] = (Math.round(num * 100) / 100);
		}
	});
}

module.exports = calculateATR;
