'use strict';

var ChartTransformer = module.exports = {
	getTransformerFor(type) {
		if (type === "none")
			return function (d) { return d; };
		return false;
	}
}