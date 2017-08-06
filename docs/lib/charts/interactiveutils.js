export function saveInteractiveNode(chartId) {
	return node => {
		this[`node_${chartId}`] = node;
	};
}

export function handleSelection(type, chartId) {
	return selectionArray => {
		const key = `${type}_${chartId}`;
		const interactive = this.state[key].map((each, idx) => {
			return {
				...each,
				selected: selectionArray[idx]
			};
		});
		this.setState({
			[key]: interactive
		});
	};
}
