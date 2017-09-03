// copied from https://github.com/d3fc/d3fc-rebind/blob/master/src/rebind.js

function createReboundMethod(target, source, name) {
	const method = source[name];
	if (typeof method !== "function") {
		throw new Error(`Attempt to rebind ${name} which isn't a function on the source object`);
	}
	return (...args) => {
		const value = method.apply(source, args);
		return value === source ? target : value;
	};
}

export default function rebind(target, source, ...names) {
	for (const name of names) {
		target[name] = createReboundMethod(target, source, name);
	}
	return target;
}
