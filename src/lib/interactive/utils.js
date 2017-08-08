import { isDefined, mapObject } from "../utils";

export function getValueFromOverride(override, index, key, defaultValue) {
	if (isDefined(override) && override.index === index)
		return override[key];
	return defaultValue;
}

export function terminate() {
	this.setState({
		current: null,
		override: null,
	});
}

export function saveNodeList(node) {
	if (isDefined(node)) {
		this.nodes[node.props.index] = node;
	}
}
export function saveNodeType(type) {
	return node => {
		this.nodes[type] = node;
	};
}
export function handleClickInteractiveType(interactiveType) {
	return function(moreProps, e) {
		e.preventDefault();

		const { onSelect } = this.props;
		if (isDefined(this.nodes)) {
			const selecedNodes = this.nodes
				.map(node => node.isHover(moreProps));
			const interactive = this.state[interactiveType].map((t, idx) => {
				return {
					...t,
					selected: selecedNodes[idx]
				};
			});
			this.setState({
				[interactiveType]: interactive
			});

			onSelect(interactive);
		}
	};
}

export function isHover(moreProps) {
	const hovering = mapObject(this.nodes, node => node.isHover(moreProps))
		.reduce((a, b) => {
			return a || b;
		});
	return hovering;
}