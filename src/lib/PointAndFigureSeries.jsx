'use strict';
var React = require('react'),
	d3 = require('d3'),
	PureRenderMixin = require('./mixin/restock-pure-render-mixin');


var PointAndFigureSeries = React.createClass({
	mixins: [PureRenderMixin],
	propTypes: {
		_xScale: React.PropTypes.func.isRequired,
		_yScale: React.PropTypes.func.isRequired,
		_xAccessor: React.PropTypes.func.isRequired,
		_yAccessor: React.PropTypes.func.isRequired,
		data: React.PropTypes.array.isRequired
	},
	statics: {
		yAccessor: (d) => ({open: d.open, high: d.high, low: d.low, close: d.close})
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.PointAndFigureSeries"
		}
	},
	handleClick(idx) {
		console.log(this.props.data[idx]);
	},
	render() {
		var width = this.props._xScale(this.props._xAccessor(this.props.data[this.props.data.length - 1]))
			- this.props._xScale(this.props._xAccessor(this.props.data[0]));

		var columnWidth = (width / (this.props.data.length - 1));

		var anyBox, j = 0;
		while (anyBox === undefined) {
			if (this.props.data[j].close !== undefined) {
				anyBox= this.props.data[j].boxes[0];
			}
			j++;
		}

		var props = this.props;
		var boxHeight = Math.abs(props._yScale(anyBox.open) - props._yScale(anyBox.close));

		// console.log(columnWidth, boxHeight);
		var columns = this.props.data
				.filter(function (d) { return d.close !== undefined; })
				.map((d, idx) => {
					var ohlc = d;
					var boxes = d.boxes.map(function (box, i) {
						var boxshape;
						if (d.direction > 0) {
							boxshape = (
								<g key={idx + "-" + i}>
									<line className="point_figure_up" x1={0} y1={props._yScale(box.open)} x2={columnWidth} y2={props._yScale(box.close)} />
									<line className="point_figure_up" x1={0} y1={props._yScale(box.close)} x2={columnWidth} y2={props._yScale(box.open)} />
								</g>
								);
						} else {
							boxshape = (
								<ellipse  key={idx + "-" + i} className="point_figure_down" cx={columnWidth/2} cy={props._yScale((box.open + box.close) / 2)}
									rx={columnWidth/2} ry={boxHeight / 2} />
								);
						}
						return boxshape;
					});
					var debug = false
						? <rect x={0} y={0} height={980} width={columnWidth} style={{ opacity: 0.1 }} onClick={this.handleClick.bind(this, idx)}/>
						: null;
					var col = (<g key={idx}
									transform={"translate(" + (props._xScale(this.props._xAccessor(d)) - (columnWidth / 2)) + ", 0)"}>
									{boxes}
									{debug}
								</g>);
					return col;
				}, this);

		return (
			<g>
				{columns}
			</g>
		);
	}
});

module.exports = PointAndFigureSeries;
