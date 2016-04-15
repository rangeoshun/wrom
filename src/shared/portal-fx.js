"use strict";
const Pixel = require('./pixel.js');
const colors = require('./colors.js');

module.exports = function portalFX ( entity ) {
  const game = entity.game;
  const createTime = new Date().getTime();
  const color = entity.color;
  const pixels = [];

  pixels.push(new Pixel());
  pixels.push(new Pixel());
  pixels.push(new Pixel());
  pixels.push(new Pixel());

  game.globals.renderCallbacks.push(function ( screen ) {
    const coords = entity.coords;
    if (!entity.alive) {
      pixels.die = true;
      return pixels;
    }

    const factor = Math.sin(new Date().getMilliseconds() / 100) + 0.2;
    pixels[0].setCoords([coords[0] + 1, coords[1]]).setColor(color, factor);
    pixels[1].setCoords([coords[0] - 1, coords[1]]).setColor(color, factor);
    pixels[2].setCoords([coords[0], coords[1] + 1]).setColor(color, factor);
    pixels[3].setCoords([coords[0], coords[1] - 1]).setColor(color, factor);

    return pixels;
  });
};
