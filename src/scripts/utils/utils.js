'use strict';

var Utils = {
	mousePosition(e) {
		var container = e.currentTarget,
			rect = container.getBoundingClientRect(),
			xy = [ e.clientX - rect.left - container.clientLeft, e.clientY - rect.top - container.clientTop ];
		return xy;
	},
}
module.exports = Utils;
