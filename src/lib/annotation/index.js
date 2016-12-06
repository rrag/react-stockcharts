"use strict";


import Annotate from "./Annotate";
import LabelAnnotation from "./LabelAnnotation";
import SvgPathAnnotation from "./SvgPathAnnotation";
import Label from "./Label";

export { Annotate, LabelAnnotation, SvgPathAnnotation, Label };

const halfWidth = 10;
const bottomWidth = 3;
const height = 20;

export function buyPath({ x, y }) {
	return `M${x} ${y} `
		+ `L${x + halfWidth} ${y + halfWidth} `
		+ `L${x + bottomWidth} ${y + halfWidth} `
		+ `L${x + bottomWidth} ${y + height} `
		+ `L${x - bottomWidth} ${y + height} `
		+ `L${x - bottomWidth} ${y + halfWidth} `
		+ `L${x - halfWidth} ${y + halfWidth} `
		+ "Z";
}

export function sellPath({ x, y }) {
	return `M${x} ${y} `
		+ `L${x + halfWidth} ${y - halfWidth} `
		+ `L${x + bottomWidth} ${y - halfWidth} `
		+ `L${x + bottomWidth} ${y - height} `
		+ `L${x - bottomWidth} ${y - height} `
		+ `L${x - bottomWidth} ${y - halfWidth} `
		+ `L${x - halfWidth} ${y - halfWidth} `
		+ "Z";
}
