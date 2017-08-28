import { isNotDefined, isDefined, mapObject } from "../utils";

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
	console.error("TODO, use saveNodeType instead");
	if (isDefined(node)) {
		this.nodes[node.props.index] = node;
	}
}

export function saveNodeType(type) {
	return node => {
		if (isNotDefined(node) && isDefined(this.nodes[type])) {
			delete this.nodes[type];
		} else {
			this.nodes[type] = node;
		}
		// console.error(this.nodes)
	};
}
export function isHoverForInteractiveType(interactiveType) {
	return function(moreProps) { // this has to be function as it is bound to this

		if (isDefined(this.nodes)) {
			const selecedNodes = this.nodes
				.map(node => node.isHover(moreProps));
			const interactive = this.props[interactiveType].map((t, idx) => {
				return {
					...t,
					selected: selecedNodes[idx]
				};
			});
			return interactive;
		}
	};
}

export function handleClickInteractiveType(interactiveType) {
	console.error("DO NOT USE THIS")
	return function(moreProps, e) { // this has to be function as it is bound to this
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

			onSelect(interactive, moreProps);
		}
	};
}

export function getElementsFactory(interactiveType) {
	return function() {
		return this.state[interactiveType];
	};
}
export function isHover(moreProps) {
	const hovering = mapObject(this.nodes, node => node.isHover(moreProps))
		.reduce((a, b) => {
			return a || b;
		});
	return hovering;
}
