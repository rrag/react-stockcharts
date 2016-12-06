
import discontinuousTimeScaleProvider, { discontinuousTimeScaleProviderBuilder } from "./discontinuousTimeScaleProvider";
import financeDiscontinuousScale from "./financeDiscontinuousScale";

export {
	discontinuousTimeScaleProviderBuilder,
	discontinuousTimeScaleProvider,
	financeDiscontinuousScale
};

export function defaultScaleProvider(xScale) {
	return (data, xAccessor) => ({ data, xScale, xAccessor, displayXAccessor: xAccessor });
}