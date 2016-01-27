"use strict";

import merge from "./merge";

import { isDefined, isNotDefined } from "../../utils/utils";

function clean(obj) {
	if (typeof obj == "object") {
		var keys = Object.keys(obj);
		keys.forEach(key => {
			var temp = clean(obj[key])
			if (isNotDefined(temp)) {
				delete obj[key];
			}
		});

		return Object.keys(obj).length > 0 ? obj : undefined;
	}
	return obj
}

export default merge().clean(clean);