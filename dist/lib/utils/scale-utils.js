'use strict';

function pushToValues(values, eachValue) {
	if (typeof eachValue === 'object' && Object.keys(eachValue).length > 0) {
		Object.keys(eachValue).forEach(function (key) {
			if (!isNaN(eachValue[key])) {
				values.push(eachValue[key]);
			}
		});
	} else {
		if (!isNaN(eachValue)) {
			values.push(eachValue);
		}
	}
}


var ScaleUtils = {
	flattenData:function(data, xAccessors, yAccessors) {
		var xValues = [];
		var yValues = [];
		data.forEach( function(row)  {
			xAccessors.forEach( function(xAccessor)  {
				var x = xAccessor(row);
				if (x !== undefined) {
					pushToValues(xValues, x);
				}
			});
			yAccessors.forEach( function(yAccessor)  {
				var y = yAccessor(row);
				if (y !== undefined) {
					pushToValues(yValues, y);
				}
			});
		})
		return {
			xValues: xValues,
			yValues: yValues
		};
	}
}
module.exports = ScaleUtils;
