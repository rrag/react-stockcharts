'use strict';

var StockScaleTransformer = require('./stockscale-transformer');
var HeikinAshiTransformer = require('./HeikinAshiTransformer');
var KagiTransformer = require('./KagiTransformer');

var ChartTransformer = {
	getTransformerFor(type) {
		if (type === "none")
			return (d) => d;
		if (type === "stockscale")
			return StockScaleTransformer;
		if (type === "heikinashi")
			return HeikinAshiTransformer;
		if (type === "kagi")
			return KagiTransformer;
		return false;
	},
	filter(data, dateAccesor, fromDate, toDate) {
		var filteredData = data.filter((each) => {
			var filtered = dateAccesor(each).getTime() > fromDate.getTime() && dateAccesor(each).getTime() < toDate.getTime()
			return filtered;
		});
		return filteredData;
	}
}

module.exports = ChartTransformer;
