import saveAsPng from 'save-svg-as-png';
import FileSaver from 'file-saver';

// ==== save-svg-as-png hack ====
//
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
    var c = String.fromCharCode('0x' + p1);
    return c === '%' ? '%25' : c;
  });
  return decodeURIComponent(data);
}
// ==== save-svg-as-png hack end ====

const SaveChartAsImage = {
  save(doc, container, {background, cb, paddings, canvg}) {
    const {
      left: paddingLeft = 0,
      top: paddingTop = 0,
      right: paddingRight = 0,
      bottom: paddingBottom = 0,
    } = paddings || {};

    const svgElement = container.getElementsByTagName('svg')[0];
    //see comment on save-svg-as-png hack.
    //we need width/height of svg here, because image.width/height is incorrect in some cases
    saveAsPng.prepareSvg(svgElement, {}, function(svg, width, height) {
      const image = new Image();
      image.onload = function() {
        const makeCanvas = () => {
          const canvas = doc.createElement('canvas');
          const context = canvas.getContext('2d');

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
          const canvasHeight =
            (height + paddingTop + paddingBottom) * pixelRatio;

          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          if (pixelRatio !== 1) {
            //don't scale context, hope source canvases are scaled by ChartCanvas code
          }

          if (background != null) {
            context.fillStyle = background;
            context.fillRect(0, 0, canvasWidth, canvasHeight);
          }
          const canvasList = container.getElementsByTagName('canvas');
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
          context.drawImage(
            image,
            paddingLeft * pixelRatio,
            paddingTop * pixelRatio,
            imageWidth * pixelRatio,
            imageHeight * pixelRatio
          );
          //check for security error bug in ie11. it will throw an error
          //synchronously, and ie11 fallback will be used (in catch block)
          canvas.toDataURL();

          //in ie11, security bug will happen here (asynchronously).
          //so, we can't handle it here, we handle it in code above (canvas.toDataURL)
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
            const canvasSvg = doc.createElement('canvas');
            canvg(canvasSvg, svg, {
              scaleWidth: imageWidth * pixelRatio,
              scaleHeight: imageHeight * pixelRatio,
            });
            context.drawImage(
              canvasSvg,
              paddingLeft * pixelRatio,
              paddingTop * pixelRatio
            );

            canvas.toBlob(cb);
          } else {
            throw new Error('Send canvg parameter (https://github.com/canvg/canvg) to handle ie11 security bug on canvas saving');
          }
        }
      };

      const uri = 'data:image/svg+xml;base64,' + window.btoa(reEncode(svgDocType + svg));
      image.src = uri;
    });
  },

  saveWithWhiteBG(container, paddings, cb) {
    return this.saveWithBG(container, 'white', paddings, cb);
  },
  saveWithDarkBG(container, paddings, cb) {
    return this.saveWithBG(container, '#303030', paddings, cb);
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
      FileSaver.saveAs(blob, 'Chart.png');
      if (cb) {
        cb();
      }
    };
    return this.save(document, container, options);
  },  
};

export default SaveChartAsImage;
