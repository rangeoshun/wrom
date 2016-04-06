"use strict";
const Pixel = require('./pixel.js');
const colors = require('./colors.js');

module.exports = function CreateFX ( entity, color ) {
  const game = entity.game;
  const createTime = new Date().getTime();
  let duration = 1000;
  color = color || entity.color;

  game.tick.onCallbacks.push(function () {
    duration -= new Date().getTime() - createTime;
    return duration > 0;
  });

  game.globals.renderCallbacks.push(function ( screen ) {
    const pixels = [];
    const coords = entity.coords;
    pixels.die = duration < 0;

    const factor = duration / 1000 + 0.001;
    pixels.push(new Pixel(0,1,1,1,[coords[0] + 1, coords[1]]).setColor(color, factor));
    pixels.push(new Pixel(0,1,1,1,[coords[0] - 1, coords[1]]).setColor(color, factor));
    pixels.push(new Pixel(0,1,1,1,[coords[0], coords[1] + 1]).setColor(color, factor));
    pixels.push(new Pixel(0,1,1,1,[coords[0], coords[1] - 1]).setColor(color, factor));

    return pixels;
  });
};
