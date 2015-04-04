'use strict';

var StockScaleTransformer = require('./stockscale-transformer');

var ChartTransformer = {
	getTransformerFor:function(type) {
		if (type === "none")
			return function(d)  {return d;};
		if (type === "stockscale")
			return StockScaleTransformer;
		return false;
	},
	filter:function(data, dateAccesor, fromDate, toDate) {
		var filteredData = data.filter(function(each)  {
			var filtered = dateAccesor(each).getTime() > fromDate.getTime() && dateAccesor(each).getTime() < toDate.getTime()
			return filtered;
		});
		return filteredData;
	}
}

module.exports = ChartTransformer;
