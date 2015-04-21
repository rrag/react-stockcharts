'use strict';

function HeikinAshiTransformer(data, options, props) {
	if (options === undefined) options = {};
	var dateAccesor = options.dateAccesor || props._dateAccessor;
	var dateMutator = options.dateMutator || props._dateMutator;
	var indexAccessor = options.indexAccessor || props._indexAccessor;
	var indexMutator = options.indexMutator || props._indexMutator;

	if (props._multiInterval && props._stockScale) {
		
		var haData = {};
		Object.keys(data)
			.forEach((key) => haData[key] = buildHA(data[key], indexAccessor, indexMutator, dateAccesor, dateMutator));
		var response = {};
		for (var key in props) {
			response[key] = props[key];
		}
		response.data = haData;
		return response;
	}
	return {
		data: data
	};
}

function buildHA(data, indexAccessor, indexMutator, dateAccesor, dateMutator) {
	var prevEach;

	var haData = data.map(function (d, i) {
		var each = {};
		indexMutator(each, indexAccessor(d));
		each.close = (d.open + d.high + d.low + d.close) / 4;

		dateMutator(each, dateAccesor(d));
		//each.displayDate = d.displayDate;

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
	console.table(haData);
	return haData;
};

module.exports = HeikinAshiTransformer;
