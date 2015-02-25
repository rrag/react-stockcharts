'use strict';
var React = require('react/addons');
// var TestUtils = React.addons.TestUtils;

var Freezer = require('freezer-js');
// Let's create a freezer store

var Chart = require('./chart');
var Translate = require('./translate');
var EventCapture = require('./event-capture');
var MouseCoordinates = require('./mouse-coordinates');

var ChartCanvas = React.createClass({
	propTypes: {
		width: React.PropTypes.number.isRequired
		, height: React.PropTypes.number.isRequired
		, margin: React.PropTypes.object
	},
	getInitialState() {
		return {};
	},
	componentWillMount() {
		var eventStore = new Freezer({
			mouseXY: [0, 0],
			mouseOver: { value: false },
			inFocus: { value: false },
			zoom: { value : 0 }
		});

		var dataStore  = new Freezer({
			tooltip: {},
			currentItem: {},
			lastItem: {},
			data: []
		});
		var stores = { eventStore: eventStore, dataStore: dataStore };
		this.updateStore(stores);

		this.listen(stores);
	},
	updateStore(store) {
		this.unListen();

		var eventStore = store.eventStore === undefined ? this.state.eventStore : store.eventStore;
		var dataStore = store.dataStore === undefined ? this.state.dataStore : store.dataStore;
		var newState = {
				eventStore: eventStore,
				dataStore: dataStore
			}
		this.setState(newState, function() { this.listen(newState) });
	},
	componentWillUnmount() {
		this.unListen();
	},
	unListen() {
		if (this.state.eventStore !== undefined) {
			this.state.eventStore.off('update', this.eventListener);
		}
		if (this.state.dataStore !== undefined) {
			this.state.dataStore.off('update', this.dataListener);
		}
	},
	listen(stores) {
		console.log('begining to listen1...', stores.eventStore, stores.dataStore);

		stores.eventStore.on('update', function(d) {
			console.log('events updated...', d);
			this.forceUpdate();
		}.bind(this))
		stores.dataStore.on('update', function(d) {
			console.log('events updated...', d);
		}.bind(this))
	},
	getDefaultProps() {
		return {
			margin: {top: 20, right: 30, bottom: 30, left: 80}
		};
	},
	renderChildren(height, width) {
		return React.Children.map(this.props.children, (child) => {
			if (typeof child.type === 'string') return child;
			var newChild = child;
			/*if (child.type === Chart.type || child.type === Translate.type) {
				newChild = React.addons.cloneWithProps(newChild, {
					_data: this.state.dataStore.get().data
				});
			}*/
			if (child.type === EventCapture.type) {
				newChild = React.addons.cloneWithProps(newChild, {
					_eventStore: this.state.eventStore
				});
			} else if (child.type === MouseCoordinates.type) {
				newChild = React.addons.cloneWithProps(newChild, {
					_show: this.state.eventStore.get().mouseOver.value,
					//_mouseXY: this.state.eventStore.get().mouseXY
				});
			}
			return React.addons.cloneWithProps(newChild, {
				_width: width
				, _height: height
			});
		});
	},
	render() {
		var w = this.props.width - this.props.margin.left - this.props.margin.right;
		var h = this.props.height - this.props.margin.top - this.props.margin.bottom;
		var transform = 'translate(' + this.props.margin.left + ',' +  this.props.margin.top + ')';
		var clipPath = '<clipPath id="chart-area-clip">'
							+ '<rect x="0" y="0" width="' + w + '" height="' + h + '" />'
						+ '</clipPath>';

		var children = this.renderChildren(h, w);

		return (
			<svg width={this.props.width} height={this.props.height}>
				<defs dangerouslySetInnerHTML={{ __html: clipPath}}></defs>
				<g transform={transform}>{children}</g>
			</svg>
		);
	}
});

module.exports = ChartCanvas;
