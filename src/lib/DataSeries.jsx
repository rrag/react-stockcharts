'use strict';

var React = require('react');

class DataSeries extends React.Component {
	render() {
		var children = React.Children.map(this.props.children, (child) => React.cloneElement(child));
		return (
			<g  style={{ "clipPath": "url(#chart-area-clip)" }}>{children}</g>
		);
	}
};

DataSeries.propTypes = {
	xAccessor: React.PropTypes.func,
	yAccessor: React.PropTypes.func.isRequired,
}

DataSeries.defaultProps = { namespace: "ReStock.DataSeries" };

module.exports = DataSeries;
