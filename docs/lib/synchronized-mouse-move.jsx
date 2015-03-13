'use strict';

var React = require('react');
var d3 = require('d3');

var ReStock = require('../../src/');


module.exports = {
	init(data) {
		var AreaChartWithEdgeCoordinates = require('./areachart-with-edge-coordinates').init(data);

		var SyncMouseMove = React.createClass({
			getInitialState() {
				return {
					width: 500,
					height: 400
				};
			},
			handleMATooltipClick(overlay) {
				console.log('You clicked on ', overlay, ' handle your onclick event here...');
			},
			componentDidMount() {
				var eventStore = this.refs.left.getEventStore();
				this.refs.right.updateEventStore(eventStore);
				// console.log('SyncMouseMove.componentDidMount', eventStore);
			},
			componentDidUpdate() {
				// console.log('SyncMouseMove.componentDidUpdate');
			},
			render() {
				var parseDate = d3.time.format("%Y-%m-%d").parse
				var dateRange = { from: parseDate("2012-06-01"), to: parseDate("2012-12-31")}
				var dateFormat = d3.time.format("%Y-%m-%d");

				return (
				<div>
					<div className="col-md-6 react-stockchart">
						<AreaChartWithEdgeCoordinates ref="left" />
					</div>
					<div className="col-md-6 react-stockchart">
						<AreaChartWithEdgeCoordinates ref="right" />
					</div>
				</div>

				);
			}
		});

		return SyncMouseMove;
	}
}

/*

							
							

						<EdgeContainer>

						</EdgeContainer>


							<EdgeIndicator
								type="horizontal"
								className="horizontal"
								itemType="last"
								orient="right"
								edgeAt="right"
								forSeries={1}
								displayFormat={(d) => (d)}
								/>
							<EdgeIndicator
								type="horizontal"
								className="horizontal"
								itemType="first"
								orient="left"
								edgeAt="left"
								forSeries={1}
								displayFormat={(d) => (d)}
								/>
*/
