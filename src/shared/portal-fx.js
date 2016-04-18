"use strict";
const Pixel = require('./pixel.js');
const colors = require('./colors.js');

module.exports = function portalFX ( entity ) {
  const game = entity.game;
  const createTime = new Date().getTime();
  const pixels = [];

  pixels.push(new Pixel());
  pixels.push(new Pixel());
  pixels.push(new Pixel());
  pixels.push(new Pixel());
  pixels.push(new Pixel());
  pixels.push(new Pixel());
  pixels.push(new Pixel());
  pixels.push(new Pixel());
  pixels.push(new Pixel());
  pixels.push(new Pixel());
  pixels.push(new Pixel());
  pixels.push(new Pixel());

  game.globals.renderCallbacks.push(function ( screen ) {
    const coords = entity.coords;
    const color = entity.color;

    if (!entity.alive) {
      pixels.die = true;
      return pixels;
    }

    const factor = Math.sin(new Date().getMilliseconds() / 100) + 0.2;
    pixels[0].setCoords([coords[0] + 1, coords[1]]).setColor(color, factor);
    pixels[1].setCoords([coords[0] - 1, coords[1]]).setColor(color, factor);
    pixels[2].setCoords([coords[0], coords[1] + 1]).setColor(color, factor);
    pixels[3].setCoords([coords[0], coords[1] - 1]).setColor(color, factor);

    pixels[4].setCoords([coords[0] + 2, coords[1]]).setColor(color, factor / 2);
    pixels[5].setCoords([coords[0] - 2, coords[1]]).setColor(color, factor / 2);
    pixels[6].setCoords([coords[0], coords[1] + 2]).setColor(color, factor / 2);
    pixels[7].setCoords([coords[0], coords[1] - 2]).setColor(color, factor / 2);

    pixels[8].setCoords([coords[0] + 1, coords[1] + 1]).setColor(color, factor / 2);
    pixels[9].setCoords([coords[0] - 1, coords[1] - 1]).setColor(color, factor / 2);
    pixels[10].setCoords([coords[0] - 1, coords[1] + 1]).setColor(color, factor / 2);
    pixels[11].setCoords([coords[0] + 1, coords[1] - 1]).setColor(color, factor / 2);
    return pixels;
  });
};
