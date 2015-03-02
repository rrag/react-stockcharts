'use strict';
var React = require('react');

var TooltipContainer = React.createClass({
	propTypes: {
		_currentItem: React.PropTypes.object.isRequired
	},
	shouldComponentUpdate(nextProps, nextState) {
		return (nextProps._currentItem !== this.props._currentItem);
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.TooltipContainer"
		}
	},
	renderChildren() {
		return React.Children.map(this.props.children, (child) => {
			if (typeof child.type === 'string') return child;
			var newChild = child;
			return React.addons.cloneWithProps(newChild, {
				_currentItem: this.props._currentItem
			});
		});
	},
	render() {
		var children = null;
		if (this.props._currentItem !== undefined) {
			children = this.renderChildren();
		};

		return (
			<g className="toottip-hover">
				{children}
			</g>
		);
	}
});

module.exports = TooltipContainer;
