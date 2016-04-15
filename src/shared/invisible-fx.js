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

  const pixels = [];

  game.globals.renderCallbacks.push(function ( screen ) {
    if (!entity.alive || !on) {
      pixels.die = true;
      pixels.splice(0);
      return pixels;
    }

    const body = entity.body;
    let length = entity.body.length

    for (let i = 0; i < length; i++) {

      if (!pixels[i]) pixels.push(new Pixel());

      let factor = Math.sqrt(Math.abs(new Date().getMilliseconds() / 1000));
      if (!i) factor *= 4;
      if (!isSelf) factor /= 10;

      pixels[i].setCoords(body[i]).setColor(color, factor);
    }

    return pixels;
  });
};
