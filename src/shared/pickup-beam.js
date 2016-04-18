"use strict";
const Pixel = require('./pixel.js');
const colors = require('./colors.js');

module.exports = function PickupBeamFX ( entity, _color, _coords ) {
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

  game.globals.renderCallbacks.push(function ( screen ) {

    if (duration <= 0) {
      pixels.die = true;
      return pixels;
    }

//    console.log(colorPicker.setColor(color).hex);
    const factor = duration / 1000 + 0.001;
    const head = entity.body[0];
    console.log(coords[0], coords[1], head[0], head[1]);
    screen.beginPath();
    screen.lineWidth = 1;
    screen.fillStyle = colorPicker.setColor(color, factor).hex;
    screen.moveTo(coords[0], coords[1]);
    screen.lineTo(head[0], head[1]);
    screen.stroke();

    return pixels;
  });
};
