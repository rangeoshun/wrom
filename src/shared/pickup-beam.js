"use strict";
const Pixel = require('./pixel.js');
const colors = require('./colors.js');

module.exports = function PickupBeamFX ( entity,  _coords, _color ) {
  const game = entity.game;
  if (!game) return;

  const createTime = new Date().getTime();
  let duration = 1000;
  const color = [_color[0], _color[1], _color[2]];
  let coords = [_coords[0], _coords[1]];
  const colorPicker = new Pixel();
  const resolution = game.globals.resolution;
  const pickupDistance = 40;

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

    const head = entity.body[0];
    const factor = duration / 1000 + 0.001;
    const offset = 3;
    const resolution = game.globals.resolution;
    const deltaX = Math.abs(coords[0] - head[0]);
    const deltaY = Math.abs(coords[1] - head[1]);

    renderer.drawLine([coords[0], coords[1] - offset], [coords[0] + offset, coords[1]], color, factor);
    renderer.drawLine([coords[0] + offset, coords[1]], [coords[0], coords[1] + offset], color, factor);
    renderer.drawLine([coords[0], coords[1] + offset], [coords[0] - offset, coords[1]], color, factor);
    renderer.drawLine([coords[0] - offset, coords[1]], [coords[0], coords[1] - offset], color, factor);

    if (deltaX > pickupDistance) {
      if (coords[0] > resolution[0] / 2) coords[0] -= resolution[0];
      else coords[0] += resolution[0];
    }

    if (deltaY > pickupDistance) {
      if (coords[1] > resolution[1] / 2) coords[1] -= resolution[1];
      else coords[1] += resolution[1];
    }

    renderer.drawLine(coords, head, color, factor);

    return pixels;
  });
};
