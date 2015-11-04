"use strict";

import React from "react";
import shallowEqual from "./utils/shallowEqual";


function getDisplayName(Series) {
	var name = Series.displayName || Series.name || "Series";
	return name;
} 

function pure(PureSeries, contextShape) {
	class PureCanvasSeries extends React.Component {
		shouldComponentUpdate(nextProps, nextState, nextContext) {
			return !shallowEqual(this.props, nextProps)
				|| !shallowEqual(this.state, nextState)
				|| !shallowEqual(this.context, nextContext);
		}
		getWrappedPureComponent() {
			return this.refs.pureSeries;
		}
		render() {
			// console.log(PureSeries.defaultProps);
			return <PureSeries ref="pureSeries"
				{...this.context}
				{...this.props} />;
		}
	};

	PureCanvasSeries.displayName = `pure(${ getDisplayName(PureSeries) })`;

	PureCanvasSeries.contextTypes = contextShape;
	PureCanvasSeries.yAccessor = PureSeries.yAccessor;

	var defaultProps = {};

	if (PureSeries.defaultProps) {
		Object.keys(PureSeries.defaultProps)
			.filter(key => key === "namespace")
			.forEach(key => {
				defaultProps[key] = PureSeries.defaultProps[key];
			});
		PureCanvasSeries.defaultProps = defaultProps;
	}

	/* Object.keys(PureSeries)
		.filter((key) => key !== "propTypes")
		.filter(key => key !== "defaultProps")
		.filter(key => key !== "displayName")
		.filter(key => key !== "contextTypes")
		.filter(key => key !== "childContextTypes")
		.forEach(key => PureCanvasSeries[key] = PureSeries[key]);*/

	// console.log(Object.keys(PureCanvasSeries))
	return PureCanvasSeries;
}

export default pure;
