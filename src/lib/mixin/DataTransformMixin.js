"use strict";
var ChartTransformer = require('../utils/ChartTransformer');

var DataTransformMixin = {
	isDataDransform() {
		return true;
	},
	transformData(props) {
		var transformer = ChartTransformer.getTransformerFor(props.transformType);
		var passThroughProps = transformer(props.data, props.options, props)
		// console.log('passThroughProps-------', passThroughProps);

		// this.setState({ passThroughProps: passThroughProps });
		return passThroughProps;
	}
};

module.exports = DataTransformMixin;
