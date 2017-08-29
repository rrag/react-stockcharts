import {
	getCurrentItem
} from "./ChartDataUtil";

import {
	last
} from "./index";
/* eslint-disable no-unused-vars */

export function mouseBasedZoomAnchor({
	xScale,
	xAccessor,
	mouseXY,
	plotData,
	fullData,
}) {
	const currentItem = getCurrentItem(xScale, xAccessor, mouseXY, plotData);
	return xAccessor(currentItem);
}

export function lastVisibleItemBasedZoomAnchor({
	xScale,
	xAccessor,
	mouseXY,
	plotData,
	fullData,
}) {
	const lastItem = last(plotData);
	return xAccessor(lastItem);
}

export function rightDomainBasedZoomAnchor({
	xScale,
	xAccessor,
	mouseXY,
	plotData,
	fullData,
}) {
	const [, end] = xScale.domain();
	return end;
}
/* eslint-enable no-unused-vars */
