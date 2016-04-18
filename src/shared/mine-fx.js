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

  const pixels = [];
  let factor;

  game.globals.renderCallbacks.push(function ( screen ) {
    pixels.die = duration < 0;

    for (let i = 0; i < count;) {

      factor = duration / 1000 + 0.001;

      if (!pixels[i]) {
        pixels.push(new Pixel(0,1,1,1,[coords[0] + i, coords[1]]));
        pixels.push(new Pixel(0,1,1,1,[coords[0] - i, coords[1]]));
        pixels.push(new Pixel(0,1,1,1,[coords[0], coords[1] + i]));
        pixels.push(new Pixel(0,1,1,1,[coords[0], coords[1] - i]));
      }

      if (pixels[i]) {
        pixels[i].setColor(color, factor);
        i++;
      }

      if (pixels[i]) {
        pixels[i].setColor(color, factor);
        i++;
      }

      if (pixels[i]) {
        pixels[i].setColor(color, factor);
        i++;
      }

      if (pixels[i]) {
        pixels[i].setColor(color, factor);
        i++;
      }
    }

    return pixels;
  });
};
