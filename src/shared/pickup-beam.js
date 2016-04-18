"use strict";
const Pixel = require('./pixel.js');
const colors = require('./colors.js');

module.exports = function PickupBeamFX ( entity,  _coords, _color ) {
  const game = entity.game;
  if (game.server) return;

  const createTime = new Date().getTime();
  let duration = 1000;
  const color = [_color[0], _color[1], _color[2]];
  const coords = [_coords[0], _coords[1]];
  const colorPicker = new Pixel();
  const pixels = [];

  game.tick.onCallbacks.push(function () {
    duration -= new Date().getTime() - createTime;
    return duration >= 0;
  });

  game.globals.renderCallbacks.unshift(function ( world ) {

    if (duration <= 0) {
      pixels.die = true;
      return pixels;
    }

    const factor = duration / 1000 + 0.001;
    const head = entity.body[0];
    const offset = 3;

    world.beginPath();
    world.lineWidth = 0.5;
    world.strokeStyle = colorPicker.setColor(color, factor).hex;
    world.moveTo(coords[0], coords[1]);
    world.lineTo(head[0], head[1]);
    world.stroke();

    world.beginPath();
    world.lineWidth = 0.5;
    world.strokeStyle = colorPicker.setColor(color, factor).hex;
    world.moveTo(coords[0], coords[1] - offset);
    world.lineTo(coords[0] + offset, coords[1]);
    world.lineTo(coords[0], coords[1] + offset);
    world.lineTo(coords[0] - offset, coords[1]);
    world.lineTo(coords[0], coords[1] - offset);
    world.stroke();

    return pixels;
  });
};
