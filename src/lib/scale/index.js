
export {
	default as discontinuousTimeScaleProvider,
	discontinuousTimeScaleProviderBuilder
} from "./discontinuousTimeScaleProvider";
export { default as financeDiscontinuousScale } from "./financeDiscontinuousScale";

export function defaultScaleProvider(xScale) {
	return (data, xAccessor) => ({ data, xScale, xAccessor, displayXAccessor: xAccessor });
}