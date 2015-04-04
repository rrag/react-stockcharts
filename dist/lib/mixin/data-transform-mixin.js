"use strict";
var ChartTransformer = require('../utils/chart-transformer');

var DataTransformMixin = {
	isDataDransform:function() {
		return true;
	},
	transformData:function(props) {
		var transformer = ChartTransformer.getTransformerFor(props.transformType);
		var passThroughProps = transformer(props.data, props.options)
		// console.log('passThroughProps-------', passThroughProps);

		// this.setState({ passThroughProps: passThroughProps });
		return passThroughProps;
	}
};

module.exports = DataTransformMixin;
