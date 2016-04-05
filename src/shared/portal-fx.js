"use strict";
const Pixel = require('./pixel.js');
const colors = require('./colors.js');

module.exports = function portalFX ( entity ) {
  const game = entity.game;
  const createTime = new Date().getTime();

  game.globals.renderCallbacks.push(function ( screen ) {
    const pixels = [];
    const color = entity.color;
    const coords = entity.coords;
    pixels.die = !entity.alive;

    const factor = Math.sin(new Date().getMilliseconds() / 100) + 0.2;
    pixels.push(new Pixel(0,0,0,0,[coords[0] + 1, coords[1]]).setColor(color, factor));
    pixels.push(new Pixel(0,0,0,0,[coords[0] - 1, coords[1]]).setColor(color, factor));
    pixels.push(new Pixel(0,0,0,0,[coords[0], coords[1] + 1]).setColor(color, factor));
    pixels.push(new Pixel(0,0,0,0,[coords[0], coords[1] - 1]).setColor(color, factor));

    return pixels;
  });
};
