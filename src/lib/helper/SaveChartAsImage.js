"use strict";

var SaveChartAsImage = {
	save(doc, container, background) {
		var svg = container.getElementsByTagName("svg")[0],
			canvasList = container.getElementsByTagName("canvas"),
			img = new Image(),
			serializer = new XMLSerializer();

		var svgStr = serializer.serializeToString(svg);
		img.setAttribute("src", "data:image/svg+xml;base64," + window.btoa(svgStr));

		var canvas = doc.createElement("canvas");
		var width = svg.getAttribute("width"), height = svg.getAttribute("height")
		canvas.width = width;
		canvas.height = height;
		var ctx = canvas.getContext("2d");

		if (background !== undefined) {
			ctx.fillStyle = background;
			ctx.fillRect(0, 0, width, height);
		}

		for (var i = 0; i < canvasList.length; i++) {
			var each = canvasList[i];
			if (each !== undefined) {
				var parent = each.parentNode.parentNode.getBoundingClientRect()
				var rect = each.getBoundingClientRect();
				ctx.drawImage(each, rect.left - parent.left, rect.top - parent.top);
			}
		};

		ctx.drawImage(img, 0, 0, width, height);
		return canvas.toDataURL("image/png");
	},
	saveWithWhiteBG(doc, container) {
		return this.save(doc, container, "white");
	}
};

module.exports = SaveChartAsImage;
