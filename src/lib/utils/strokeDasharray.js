export const strokeDashTypes = [
	"Solid",
	"ShortDash",
	"ShortDot",
	"ShortDashDot",
	"ShortDashDotDot",
	"Dot",
	"Dash",
	"LongDash",
	"DashDot",
	"LongDashDot",
	"LongDashDotDot",
];

export const getStrokeDasharray = (type) => {
	switch (type) {
	default:
	case "Solid":
		return "none";
	case "ShortDash":
		return "6, 2";
	case "ShortDot":
		return "2, 2";
	case "ShortDashDot":
		return "6, 2, 2, 2";
	case "ShortDashDotDot":
		return "6, 2, 2, 2, 2, 2";
	case "Dot":
		return "2, 6";
	case "Dash":
		return "8, 6";
	case "LongDash":
		return "16, 6";
	case "DashDot":
		return "8, 6, 2, 6";
	case "LongDashDot":
		return "16, 6, 2, 6";
	case "LongDashDotDot":
		return "16, 6, 2, 6, 2, 6";
	}
};
