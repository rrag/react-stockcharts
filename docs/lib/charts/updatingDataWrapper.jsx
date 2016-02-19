"use strict";

import React from "react";

function getDisplayName(ChartComponent) {
	var name = ChartComponent.displayName || ChartComponent.name || "ChartComponent";
	return name;
}

export default function updatingDataWrapper(ChartComponent) {
	var interval;
	const LENGTH = 130;
	var func;
	var speed = 1000;

	class UpdatingComponentHOC extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				length: LENGTH,
				data: this.props.data.slice(0, LENGTH),
			}
			this.onKeyPress = this.onKeyPress.bind(this);
		}
		componentDidMount() {
			document.addEventListener("keyup", this.onKeyPress);
		}
		componentWillUnmount() {
			if (interval) clearInterval(interval);
			document.removeEventListener("keyup", this.onKeyPress);
		}
		onKeyPress(e) {
			var keyCode = e.which;
			console.log(keyCode);
			switch (keyCode) {
				case 50: {
					// 2 (50) - Start alter data
					func = () => {
						if (this.state.length < this.props.data.length) {
							this.setState({
								length: this.state.length + 1,
								data: this.props.data.slice(0, this.state.length + 1),
							})
						}
					};
					break;
				}
				case 80:
					// P (80)
				case 49: {
					// 1 (49) - Start Push data
					func = () => {
						if (this.state.length < this.props.data.length) {
							this.setState({
								length: this.state.length + 1,
								data: this.props.data.slice(0, this.state.length + 1),
							})
						}
					};
					break;
				}
				case 27: {
					// ESC (27) - Clear interval
					func = null;
					if (interval) clearInterval(interval);
					break;
				}
				case 107: {
					// + (107) - increase the speed
					speed = Math.max(speed / 2, 50);
					break;
				}
				case 109:
				case 189: {
					// - (189, 109) - reduce the speed
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
			var { data } = this.state;

			return <ChartComponent ref="component" data={data} type={type}/>;
		}
	}
	UpdatingComponentHOC.defaultProps = {
		type: "svg",
	};
	UpdatingComponentHOC.displayName = `updatingDataWrapper(${ getDisplayName(ChartComponent) })`;

	return UpdatingComponentHOC
}