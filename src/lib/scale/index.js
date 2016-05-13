
/*
import financeEODCalculator from "./financeEODCalculator";
import financeEODDiscontinuousScale from "./financeEODDiscontinuousScale";
import eodIntervalCalculator from "./eodIntervalCalculator";
import identityIntervalCalculator from "./identityIntervalCalculator";
import financeIntradayDiscontinuousScale from "./financeIntradayDiscontinuousScale";
import financeIntradayCalculator from "./financeIntradayCalculator";
import intradayIntervalCalculator from "./intradayIntervalCalculator";
*/
import discontinuousTimeScaleProvider from "./discontinuousTimeScaleProvider";

export {
	/* financeEODCalculator,
	financeEODDiscontinuousScale,
	identityIntervalCalculator,
	eodIntervalCalculator,
	financeIntradayDiscontinuousScale,
	financeIntradayCalculator,
	intradayIntervalCalculator,*/

	discontinuousTimeScaleProvider
};

export function defaultScaleProvider(xScale) {
	return (data, xAccessor) => ({ data, xScale, xAccessor, displayXAccessor: xAccessor });
}