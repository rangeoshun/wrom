"use strict";
const Pixel = require('./pixel.js');
const colors = require('./colors.js');

module.exports = function InvisibleFX ( entity ) {
  const game = entity.game;
  const createTime = new Date().getTime();
  const isSelf = entity.id === game.globals.selfID;
  const color = [0.3,0.3,0.3];
  let on = true;

  setTimeout(function () {
    on = !on;
  }, 10000);

  game.globals.renderCallbacks.push(function ( screen ) {
    const pixels = [];
    const body = entity.body;
    const length = entity.body.length;
    pixels.die = !on;

    for (let i = 0; i < length; i++) {
      let factor = Math.sqrt(Math.abs(new Date().getMilliseconds() / 1000));
      if (!i) factor *= 3;
      if (!isSelf) factor /= 10;

      const coords = body[i];

      pixels.push(new Pixel(0,1,1,1,coords).setColor(color, factor));
    }

    return pixels;
  });
};
