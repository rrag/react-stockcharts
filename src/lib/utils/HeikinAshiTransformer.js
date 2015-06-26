"use strict";

function buildHA(data, indexAccessor, indexMutator, dateAccessor, dateMutator) {
	var prevEach;

	var haData = data.map((d) => {
		var each = {};
		indexMutator(each, indexAccessor(d));
		each.close = (d.open + d.high + d.low + d.close) / 4;

		dateMutator(each, dateAccessor(d));

		if (!prevEach) {
			each.open = d.open;
			each.high = d.high;
			each.low = d.low;
		} else {
			each.open = (prevEach.open + prevEach.close) / 2;
			each.high = Math.max(each.open, d.high, each.close);
			each.low = Math.min(each.open, d.low, each.close);
			each.trueRange = Math.max(
					d.high - d.low
					, d.high - prevEach.close
					, d.low - prevEach.close
				);
		}
		each.volume = d.volume;

		each.startOfWeek = d.startOfWeek;
		each.startOfMonth = d.startOfMonth;
		each.startOfQuarter = d.startOfQuarter;
		each.startOfYear = d.startOfYear;

		prevEach = each;
		return each;
	});
	// console.table(haData);
	return haData;
}

function HeikinAshiTransformer(data, interval, options, other) {

	var { dateAccessor, dateMutator, indexAccessor, indexMutator } = options;
	// console.log(data, options);

	var haData = {};
	Object.keys(data)
		.forEach((key) => haData[key] = buildHA(data[key], indexAccessor, indexMutator, dateAccessor, dateMutator));

	return {
		data: haData,
		other: other,
		options: options
	};
}

module.exports = HeikinAshiTransformer;
