"use strict";

import React from "react";

function getDisplayName(ChartComponent) {
	var name = ChartComponent.displayName || ChartComponent.name || "ChartComponent";
	return name;
}

export default function updatingDataWrapper(ChartComponent) {
	var interval, length = 130, rawData;
	var func;
	var speed = 1000;

	class UpdatingComponentHOC extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				data: this.props.data.slice(0, length),
			}
			this.onKeyPress = this.onKeyPress.bind(this);
		}
		componentDidMount() {
			document.addEventListener("keypress", this.onKeyPress);
		}
		componentWillUnmount() {
			if (interval) clearInterval(interval);
			document.removeEventListener("keypress", this.onKeyPress);
		}
		onKeyPress(e) {
			var keyCode = e.which;
			switch (keyCode) {
				case 50: {
					// 2 (50) - Start alter data
					func = () => {
						var exceptLast = rawData.slice(0, rawData.length - 1);
						var last = rawData[rawData.length - 1];

						last = {
							...last,
							close: (Math.random() * (last.high - last.low)) + last.close
						}

						this.refs.component.getChartCanvas().alterData(exceptLast.concat(last));

					};
					break;
				}
				case 49: {
					// 1 (49) - Start Push data
					func = () => {
						var pushMe = this.props.data.slice(length, length + 1);
						rawData = rawData.concat(pushMe);
						this.refs.component.getChartCanvas().pushData(pushMe);
						length ++;
						if (this.props.data.length === length) clearInterval(interval);
					};
					break;
				}
				case 48: {
					// 0 (48) - Clear interval
					func = null;
					if (interval) clearInterval(interval);
					break;
				}
				case 43: {
					// + (43) - increase the speed
					speed = Math.max(speed / 2, 100);
					break;
				}
				case 45: {
					// - (45) - reduce the speed
					var delta = Math.min(speed, 1000);
					speed = speed + delta;
					break;
				}
			}
			if (func) {
				if (interval) clearInterval(interval);
				console.log("speed  = ", speed);
				interval = setInterval(func, speed);
			}
		}
		render() {
			var { type } = this.props;
			rawData = this.state.data;
			console.log(rawData.length);
			return <ChartComponent ref="component" data={rawData} type={type}/>;
		}
	}
	UpdatingComponentHOC.defaultProps = {
		type: "svg",
	};
	UpdatingComponentHOC.displayName = `updatingDataWrapper(${ getDisplayName(ChartComponent) })`;

	return UpdatingComponentHOC
}