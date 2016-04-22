"use strict";

module.exports = class Pixel {
  constructor ( drawn, r, g, b, coords ) {
    const pixel = this;

    if (drawn instanceof Array) {

      pixel[4] = drawn;

    } else {

      pixel[0] = drawn || 0;
      pixel[1] =  r || 0;
      pixel[2] =  g || 0;
      pixel[3] =  b || 0;
      pixel[4] =  coords;
    }

    let screenOffset;
    pixel.renderTo = function ( context, bounds, normBounds, alphaFactor, imageData ) {
      imageData.data[0] = pixel.r;
      imageData.data[1] = pixel.g;
      imageData.data[2] = pixel.b;
      imageData.data[3] = 255 * alphaFactor;
      context.putImageData(imageData, pixel[4][0] - bounds[0][0] + bounds[2][0], pixel[4][1] - bounds[0][1] + bounds[2][1]);
    };
  }


  get r () {
    let component = this[1];

    if (!component) return 0;
    else return Math.round(component*255);
  }

  get g () {
    let component = this[2];

    if (!component) return 0;
    else return Math.round(component*255);
  };

  get b () {
    let component = this[3];

    if (!component) return 0;
    else return Math.round(component*255);
  };

  get hex () {
    const pixel = this;

    let r = this.r.toString(16);
    let g = this.g.toString(16);
    let b = this.b.toString(16);

    if (r.length === 1) r = '0' + r;
    if (g.length === 1) g = '0' + g;
    if (b.length === 1) b = '0' + b;

    return '#'+ r + g + b;
  };

  setCoords ( coords ) {
    const pixel = this;
    pixel[4] = coords;
    return pixel;
  }

  setColor ( colorArray, factor ) {
    const pixel = this;

    factor = factor ? factor : 1;

    if (!colorArray) return pixel;

    pixel[1] = Math.min(Math.round(colorArray[0]*1000)/1000, 1) * factor;
    pixel[2] = Math.min(Math.round(colorArray[1]*1000)/1000, 1) * factor;
    pixel[3] = Math.min(Math.round(colorArray[2]*1000)/1000, 1) * factor;

    return pixel;
  }

  isEmpty ( pixel ) {
    return !this[0];
  }
};
