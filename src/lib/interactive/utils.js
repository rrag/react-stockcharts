import { isDefined } from "../utils";

export function getValueFromOverride(override, index, key, defaultValue) {
	if (isDefined(override) && override.index === index)
		return override[key];
	return defaultValue;
}
