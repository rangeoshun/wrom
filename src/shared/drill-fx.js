"use strict";
const Pixel = require('./pixel.js');
const colors = require('./colors.js');

module.exports = function DrillFX ( entity ) {
  const game = entity.game;
  const createTime = new Date().getTime();
  const isSelf = entity.id === game.globals.selfID;
  const color = colors.red;
  const flameColor = colors.yellow;
  let on = true;

  setTimeout(function () {
    on = !on;
  }, 10000);

  game.globals.renderCallbacks.push(function ( screen ) {
    const pixels = [];
    const body = entity.body;
    const length = entity.body.length;
    pixels.die = !on;

    let factor = Math.sin(new Date().getMilliseconds() / 100);

    const coords = body[0];
    pixels.push(new Pixel(0,0,0,0,[coords[0] + 1, coords[1]]).setColor(flameColor, factor));
    pixels.push(new Pixel(0,0,0,0,[coords[0] - 1, coords[1]]).setColor(flameColor, factor));
    pixels.push(new Pixel(0,0,0,0,[coords[0], coords[1] + 1]).setColor(flameColor, factor));
    pixels.push(new Pixel(0,0,0,0,[coords[0], coords[1] - 1]).setColor(flameColor, factor));
    pixels.push(new Pixel(0,0,0,0,[coords[0], coords[1]]).setColor(color, factor));

    return pixels;
  });
};
