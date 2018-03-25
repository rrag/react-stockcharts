

import saveAsPng from "save-svg-as-png";
import { isDefined } from "../utils";

const dx = 0;
const dy = 0;

const SaveChartAsImage = {
	save(doc, container, background, cb) {
		saveAsPng.svgAsDataUri(container.getElementsByTagName("svg")[0], {}, function(uri) {
			// eslint-disable-next-line prefer-const
			let image = new Image();
			image.onload = function() {

				// eslint-disable-next-line prefer-const
				let canvas = doc.createElement("canvas");
				canvas.width = image.width;
				canvas.height = image.height;

				// eslint-disable-next-line prefer-const
				let context = canvas.getContext("2d");

				if (isDefined(background)) {
					context.fillStyle = background;
					context.fillRect(0, 0, canvas.width, canvas.height);
				}
				const canvasList = container.getElementsByTagName("canvas");
				for (let i = 0; i < canvasList.length; i++) {
					const each = canvasList[i];
					if (isDefined(each)) {
						const parent = each.parentNode.parentNode.getBoundingClientRect();
						const rect = each.getBoundingClientRect();
						context.drawImage(each, rect.left - parent.left + dx, rect.top - parent.top + dy);
					}
				}

				context.drawImage(image, dx, dy);
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
			const a = document.createElement("a");
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