"use strict";
const Pixel = require('./pixel.js');
const colors = require('./colors.js');

module.exports = function MineFX ( entity ) {
  const game = entity.game;
  const color = colors.red;
  const coords = entity.coords;
  const createTime = new Date().getTime();
  let count = 0;
  let duration = 1000;

  game.tick.onCallbacks.push(function () {
    duration -= new Date().getTime() - createTime;
    if (count < entity.countLength) count++;
    return duration > 0;
  });

  game.globals.renderCallbacks.push(function ( screen ) {
    const pixels = [];
    pixels.die = duration < 0;

    for (let i = 0; i < count; i++) {
      const factor = duration / 1000 + 0.001;
      pixels.push(new Pixel(0,1,1,1,[coords[0] + i, coords[1]]).setColor(color, factor));
      pixels.push(new Pixel(0,1,1,1,[coords[0] - i, coords[1]]).setColor(color, factor));
      pixels.push(new Pixel(0,1,1,1,[coords[0], coords[1] + i]).setColor(color, factor));
      pixels.push(new Pixel(0,1,1,1,[coords[0], coords[1] - i]).setColor(color, factor));
    }

    return pixels;
  });
};
