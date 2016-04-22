"use strict";
const Pixel = require('./pixel.js');
const colors = require('./colors.js');

module.exports = function PickupBeamFX ( entity,  _coords, _color ) {
  const game = entity.game;
  if (!game) return;

  const createTime = new Date().getTime();
  let duration = 1000;
  const color = [_color[0], _color[1], _color[2]];
  const coords = [_coords[0], _coords[1]];
  const colorPicker = new Pixel();

  game.tick.onCallbacks.push(function () {
    duration -= new Date().getTime() - createTime;
    return duration >= 0;
  });
  const pixels = [];

  game.globals.renderCallbacks.unshift(function ( world, renderer ) {

    if (duration <= 0 || !entity.alive) {
      pixels.die = true;
      return pixels;
    }

    const factor = duration / 1000 + 0.001;
    const head = entity.body[0];
    const offset = 3;

    renderer.drawLine(coords, head, color, factor);

    renderer.drawLine([coords[0], coords[1] - offset], [coords[0] + offset, coords[1]], color, factor);
    renderer.drawLine([coords[0] + offset, coords[1]], [coords[0], coords[1] + offset], color, factor);
    renderer.drawLine([coords[0], coords[1] + offset], [coords[0] - offset, coords[1]], color, factor);
    renderer.drawLine([coords[0] - offset, coords[1]], [coords[0], coords[1] - offset], color, factor);

//    console.log(pixels)

    return pixels;
  });
};
