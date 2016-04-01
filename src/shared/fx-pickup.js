"use strict";
const Pixel = require('./pixel.js');
const colors = require('./colors.js');

module.exports = function pickUpFX ( entity ) {
  const game = entity.game;
  const createTime = new Date().getTime();
  const direction = [entity.direction[0], entity.direction[1]];
  const coords = [entity.coords[0], entity.coords[1]];
  const baseColor = colors.lightCyan;
  let duration = 500;
  let lineLength = 0;
  game.tick.onCallbacks.push(function () {
    lineLength++;
    console.log(lineLength);
    duration -= new Date().getTime() - createTime;
    return duration > 1;
  });

  game.globals.renderCallbacks.push(function () {
    const pixels = [];
    pixels.die = duration < 1;

    for (let i = 0; i < lineLength + 1; i++) {
      let dimension = direction[0] ? 1 : 0;
      pixels.push(new Pixel(0,1,1,1,[direction[dimension] + i]).setColor(baseColor));
      pixels.push(new Pixel(0,1,1,1,[direction[dimension] - i]).setColor(baseColor));
    }

    return pixels;
  });
};
