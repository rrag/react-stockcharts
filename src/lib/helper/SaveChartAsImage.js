import saveAsPng from "save-svg-as-png";
import FileSaver from "file-saver";

// ==== save-svg-as-png hack ====
// we want width/height from svg, because Image.width/height returns 0 in IE11.
// saveAsPng.svgAsDataUri does not give us width/height in done parameter.
// therefore, we use saveAsPng.prepareSvg and copy some code from saveAsPng
// (svg encode).
// We will remove this code and use saveAsPng.svgAsDataUri when this PR will
// be accepted: https://github.com/exupero/saveSvgAsPng/pull/193
const svgDocType = '<?xml version="1.0" standalone="no"?>' +
  '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ' +
    '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" [<!ENTITY nbsp "&#160;">]>';

function reEncode(data) {
	data = encodeURIComponent(data);
	data = data.replace(/%([0-9A-F]{2})/g, function(match, p1) {
		const c = String.fromCharCode("0x" + p1);
		return c === "%" ? "%25" : c;
	});
	return decodeURIComponent(data);
}
// ==== save-svg-as-png hack end ====

const SaveChartAsImage = {
	save(doc, container, { background, cb, paddings, canvg }) {
		const {
			left: paddingLeft = 0,
			top: paddingTop = 0,
			right: paddingRight = 0,
			bottom: paddingBottom = 0,
		} = paddings || {};

		const svgElement = container.getElementsByTagName("svg")[0];
		// see comment on save-svg-as-png hack.
		// we need width/height of svg here, because Image.width/height returns 0 in IE11
		// maybe, this bug exits only when we set image.src to svg as dataurl...
		// anyway, this bug exists, and we need some workaround for it.
		saveAsPng.prepareSvg(svgElement, {}, function(svgDataUri, width, height) {
			const image = new Image();
			// eslint-disable-next-line const-immutable/no-mutation
			image.onload = function() {
				const makeCanvas = () => {
					const canvas = doc.createElement("canvas");
					const context = canvas.getContext("2d");

					// we should correctly scale canvas (for devices with Retina-like screen)
					const devicePixelRatio = window.devicePixelRatio || 1;
					const backingStoreRatio =
						context.webkitBackingStorePixelRatio ||
						context.mozBackingStorePixelRatio ||
						context.msBackingStorePixelRatio ||
						context.oBackingStorePixelRatio ||
						context.backingStorePixelRatio ||
						1;

					const pixelRatio = devicePixelRatio / backingStoreRatio;

					const canvasWidth = (width + paddingLeft + paddingRight) * pixelRatio;
					const canvasHeight = (height + paddingTop + paddingBottom) * pixelRatio;

					// eslint-disable-next-line const-immutable/no-mutation
					canvas.width = canvasWidth;
					// eslint-disable-next-line const-immutable/no-mutation
					canvas.height = canvasHeight;
					if (pixelRatio !== 1) {
						// don't scale context, because source canvases are scaled by ChartCanvas code
					}

					if (background != null) {
						// eslint-disable-next-line const-immutable/no-mutation
						context.fillStyle = background;
						context.fillRect(0, 0, canvasWidth, canvasHeight);
					}
					const canvasList = container.getElementsByTagName("canvas");
					for (let i = 0; i < canvasList.length; i++) {
						const each = canvasList[i];
						if (each) {
							const parent = each.parentNode.parentNode.getBoundingClientRect();
							const rect = each.getBoundingClientRect();
							context.drawImage(
								each,
								(rect.left - parent.left + paddingLeft) * pixelRatio,
								(rect.top - parent.top + paddingTop) * pixelRatio
							);
						}
					}

					const imageWidth = image.width;
					const imageHeight = image.height;
					return [canvas, context, pixelRatio, imageWidth, imageHeight];
				};

				try {
					const [
						canvas,
						context,
						pixelRatio,
						imageWidth,
						imageHeight,
					] = makeCanvas();

					// draw svg image (svg layer ChartCanvas) to canvas with all canvas layers painted.
					// in ie11, after painting any image (even with src as svg/dataUrl) to canvas, canvas
					// will became locked to save, and canvas.toBlob will cause error
					context.drawImage(
						image,
						paddingLeft * pixelRatio,
						paddingTop * pixelRatio,
						imageWidth * pixelRatio,
						imageHeight * pixelRatio
					);

					// check for security error bug in ie11. it will throw an error
					// synchronously, and ie11 fallback will be used (in catch block)
					canvas.toDataURL();

					// in ie11, security bug will happen here (asynchronously).
					// so, we can't handle it here, we handle it in code above (canvas.toDataURL)
					canvas.toBlob(cb);
				} catch (e) {
					if (canvg) {
						const [
							canvas,
							context,
							pixelRatio,
							imageWidth,
							imageHeight,
						] = makeCanvas();

						// use canvg as fallback for ie11, to draw svg layer using canvas api
						// ie11 locks canvas after drawing any image, and it became impossible to save
						const canvasSvg = doc.createElement("canvas");
						canvg(canvasSvg, svgDataUri, {
							scaleWidth: imageWidth * pixelRatio,
							scaleHeight: imageHeight * pixelRatio,
						});

						// draw canvas with svg-layer to canvas. it is safe for ie11 (and other buggy browsers)
						context.drawImage(
							canvasSvg,
							paddingLeft * pixelRatio,
							paddingTop * pixelRatio
						);

						canvas.toBlob(cb);
					} else {
						throw new Error("Send canvg parameter (https://github.com/canvg/canvg) to handle ie11 security bug on canvas saving");
					}
				}
			};

			const uri = "data:image/svg+xml;base64," + window.btoa(reEncode(svgDocType + svgDataUri));
			// eslint-disable-next-line const-immutable/no-mutation
			image.src = uri;
		});
	},

	saveWithWhiteBG(container, paddings, cb) {
		return this.saveWithBG(container, "white", paddings, cb);
	},
	saveWithDarkBG(container, paddings, cb) {
		return this.saveWithBG(container, "#303030", paddings, cb);
	},
	saveWithBG(container, background, paddings, cb) {
		return this.save(document, container, { background, paddings, cb });
	},
	saveChartAsImage(container, background, paddings, cb) {
		return this.saveChartAsImageWithOptions(container, {
			background, paddings, cb
		});
	},
	saveChartAsImageWithOptions(container, options) {
		const cb = blob => {
			FileSaver.saveAs(blob, options.fileName || "Chart.png");
			if (options.cb) {
				options.cb();
			}
		};
		return this.save(document, container, {
			...options,
			cb
		});
	},
};

export default SaveChartAsImage;
