"use strict";
const Pixel = require("./pixel.js");

module.exports = CreateFX;

const defaultPixels = [];

function CreateFX(
  entity,
  color,
  _game,
  _createTime = new Date().getTime(),
  _duration = 1000,
  _pixels = defaultPixels.splice()
) {
  return (
    (_game = entity.game),
    (color = color || entity.color),
    _pixels.push(new Pixel()),
    _pixels.push(new Pixel()),
    _pixels.push(new Pixel()),
    _pixels.push(new Pixel()),
    _game.tick.onCallbacks.push(
      (_currentTime = new Date().getTime()) => (
        (_duration -= _currentTime - _createTime), _duration >= 0
      )
    ),
    _game.globals.renderCallbacks.push(
      (_, _coords, _factor) => (
        (_coords = entity.coords),
        (_duration <= 0 && (_pixels.die = true)) ||
          ((_factor = _duration / 1000 + 0.001),
          _pixels[0]
            .setCoords([_coords[0] + 1, _coords[1]])
            .setColor(color, _factor),
          _pixels[1]
            .setCoords([_coords[0] - 1, _coords[1]])
            .setColor(color, _factor),
          _pixels[2]
            .setCoords([_coords[0], _coords[1] + 1])
            .setColor(color, _factor),
          _pixels[3]
            .setCoords([_coords[0], _coords[1] - 1])
            .setColor(color, _factor)),
        _pixels
      )
    )
  );
}
