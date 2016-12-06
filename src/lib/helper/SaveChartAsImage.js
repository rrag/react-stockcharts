"use strict";

import saveAsPng from "save-svg-as-png";
import { isDefined } from "../utils";

var SaveChartAsImage = {
	save(doc, container, background, cb) {
		saveAsPng.svgAsDataUri(container.getElementsByTagName("svg")[0], {}, function(uri) {
			var image = new Image();
			image.onload = function() {
				var canvas = doc.createElement("canvas");
				canvas.width = image.width;
				canvas.height = image.height;
				var context = canvas.getContext("2d");

				if (isDefined(background)) {
					context.fillStyle = background;
					context.fillRect(0, 0, canvas.width, canvas.height);
				}
				var canvasList = container.getElementsByTagName("canvas");
				for (var i = 0; i < canvasList.length; i++) {
					var each = canvasList[i];
					if (isDefined(each)) {
						var parent = each.parentNode.parentNode.getBoundingClientRect();
						var rect = each.getBoundingClientRect();
						context.drawImage(each, rect.left - parent.left, rect.top - parent.top);
					}
				}

				context.drawImage(image, 0, 0);
				cb(canvas.toDataURL("image/png"));
			};
			image.src = uri;
		});
	},
	saveWithWhiteBG(doc, container, cb) {
		return this.saveWithBG(doc, container, "white", cb);
	},
	saveWithDarkBG(doc, container, cb) {
		return this.saveWithBG(doc, container, "#303030", cb);
	},
	saveWithBG(doc, container, background, cb) {
		return this.save(doc, container, background, cb);
	},
	saveChartAsImage(container) {
		this.saveWithWhiteBG(document, container, function(src) {
			var a = document.createElement("a");
			a.setAttribute("href", src);
			a.setAttribute("download", "Chart.png");

			document.body.appendChild(a);
			a.addEventListener("click", function(/* e */) {
				a.parentNode.removeChild(a);
			});

			a.click();
		});
	}
};

export default SaveChartAsImage;