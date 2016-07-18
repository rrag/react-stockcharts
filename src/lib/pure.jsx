"use strict";

import React, { Component } from "react";
import { shallowEqual } from "./utils";

function getDisplayName(Series) {
	var name = Series.displayName || Series.name || "Series";
	return name;
}

function pure(PureSeries, contextShape, ignorePropKeys = []) {
	class PureCanvasSeries extends Component {
		shouldComponentUpdate(nextProps, nextState, nextContext) {
			return !shallowEqual(this.props, nextProps)
				|| !shallowEqual(this.state, nextState)
				|| !shallowEqual(this.context, nextContext);
		}
		getWrappedComponent() {
			return this.refs.pureSeries;
		}
		render() {
			var ctx = {};
			Object.keys(this.context)
				.filter(key => ignorePropKeys.indexOf(key) === -1)
				.forEach(key => {
					ctx[key] = this.context[key];
				});
			return <PureSeries ref="pureSeries"
				{...ctx}
				{...this.props} />;
		}
	}

	PureCanvasSeries.displayName = `pure(${ getDisplayName(PureSeries) })`;

	PureCanvasSeries.contextTypes = contextShape;

	var defaultProps = {};

	if (PureSeries.defaultProps) {
		Object.keys(PureSeries.defaultProps)
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
