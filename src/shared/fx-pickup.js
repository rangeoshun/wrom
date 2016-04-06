"use strict";
const Pixel = require('./pixel.js');
const colors = require('./colors.js');

module.exports = function PickUpFX ( entity, color ) {
  const game = entity.game;
  const createTime = new Date().getTime();
  let duration = 1000;

  game.tick.onCallbacks.push(function () {
    duration -= new Date().getTime() - createTime;
    return duration > 0;
  });

  game.globals.renderCallbacks.push(function ( screen ) {
    const pixels = [];
    pixels.die = duration < 0;

    for (let i = 0; i < entity.body.length; i++) {
      const factor = duration / 1000;
      const r = entity.color[0] + (color[0] - entity.color[0]) * factor;
      const g = entity.color[1] + (color[1] - entity.color[1]) * factor;
      const b = entity.color[2] + (color[2] - entity.color[2]) * factor;
      const coords = entity.body[i];

      pixels.push(new Pixel(0,1,1,1,coords).setColor([r,g,b]));
    }

    return pixels;
  });
};
