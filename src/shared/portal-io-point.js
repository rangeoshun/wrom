"use strict";
const Point = require('./point.js');
const colors = require('./colors.js');

module.exports = class PortalIOPoint extends Point {
  constructor ( game ) {
    super(game);
    const point = this;
    point.alive = true;
    point.value = 50;
    point.type = 'piop';
  }

  onCollision ( player ) {
    const point = this;
    const coords = point.pair.coords;
    const direction = player.direction;
    player.body[0] = [coords[0] + direction[0], coords[1] + direction[1]];

    return point.alive;
  }
};
