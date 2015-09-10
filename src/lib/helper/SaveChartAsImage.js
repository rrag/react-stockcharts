"use strict";

var saveAsPng = require("save-svg-as-png");

var SaveChartAsImage = {
	save(doc, container, background, cb) {
		if (saveAsPng === undefined) {
			throw new Error("dependency save-svg-as-png is not installed, execute npm install -S save-svg-as-png");
		}
		saveAsPng.svgAsDataUri(container.getElementsByTagName("svg")[0], {}, function(uri) {
			var image = new Image();
			image.onload = function() {
				var canvas = doc.createElement('canvas');
				canvas.width = image.width;
				canvas.height = image.height;
				var context = canvas.getContext('2d');

				if (background !== undefined) {
					context.fillStyle = background;
					context.fillRect(0, 0, canvas.width, canvas.height);
				}
				var canvasList = container.getElementsByTagName("canvas");
				for (var i = 0; i < canvasList.length; i++) {
					var each = canvasList[i];
					if (each !== undefined) {
						var parent = each.parentNode.parentNode.getBoundingClientRect();
						var rect = each.getBoundingClientRect();
						context.drawImage(each, rect.left - parent.left, rect.top - parent.top);
					}
				};

				context.drawImage(image, 0, 0);
				cb(canvas.toDataURL('image/png'));
			};
			image.src = uri;
		});
	},
	saveWithWhiteBG(doc, container, cb) {
		return this.save(doc, container, "white", cb);
	},
	saveChartAsImage(container) {
		this.saveWithWhiteBG(document, container, function(src) {
			var a = document.createElement("a");
			a.setAttribute("href", src);
			a.setAttribute("download", "Chart.png");

			document.body.appendChild(a);
			a.addEventListener("click", function(e) {
				a.parentNode.removeChild(a);
			});

			a.click();
		});
	}
};

module.exports = SaveChartAsImage;