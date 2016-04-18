"use strict";
const Pixel = require('./pixel.js');
const colors = require('./colors.js');

module.exports = function CreateFX ( entity, color) {
  const game = entity.game;
  const createTime = new Date().getTime();
  let duration = 1000;
  const pixels = [];

  color = color || entity.color;
  pixels.push(new Pixel());
  pixels.push(new Pixel());
  pixels.push(new Pixel());
  pixels.push(new Pixel());

  game.tick.onCallbacks.push(function () {
    duration -= new Date().getTime() - createTime;
    return duration >= 0;
  });

  game.globals.renderCallbacks.push(function ( screen ) {
    let coords = entity.coords;

    if (duration <= 0) {
      pixels.die = true;
    }

    const factor = duration / 1000 + 0.001;
    pixels[0].setCoords([coords[0] + 1, coords[1]]).setColor(color, factor);
    pixels[1].setCoords([coords[0] - 1, coords[1]]).setColor(color, factor);
    pixels[2].setCoords([coords[0], coords[1] + 1]).setColor(color, factor);
    pixels[3].setCoords([coords[0], coords[1] - 1]).setColor(color, factor);

    return pixels;
  });
};
