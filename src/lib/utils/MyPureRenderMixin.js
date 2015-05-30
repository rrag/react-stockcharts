'use strict';

var shallowEqual = require("react/lib/shallowEqual");

var PureRenderMixin = {
	shouldComponentUpdate(nextProps, nextState, nextContext) {
		return !shallowEqual(this.props, nextProps)
			|| !shallowEqual(this.state, nextState)
			|| !shallowEqual(this.context, nextContext);
	}
};

module.exports = PureRenderMixin;