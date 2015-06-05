'use strict';

var React = require('react');
var shallowEqual = require("react/lib/shallowEqual");

class PureComponent extends React.Component {
	shouldComponentUpdate(nextProps, nextState, nextContext) {
		return !shallowEqual(this.props, nextProps)
			|| !shallowEqual(this.state, nextState)
			|| !shallowEqual(this.context, nextContext);
	}
}

module.exports = PureComponent;