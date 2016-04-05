"use strict";
const Point = require('./point.js');
const Pixel = require('./pixel.js');
const colors = require('./colors.js');
const portalFX = require('./portal-fx.js');

module.exports = class PortalIOPoint extends Point {
  constructor ( game ) {
    super(game);
    const point = this;
    point.alive = true;
    point.value = 50;
    point.type = 'piop';
    point.direction = [0,0];

    if (!game.server) new portalFX(point);
  }

  onCollision ( player ) {
    const point = this;
    const game = point.game;
    const coords = point.pair.coords;
    const direction = player.direction;
    player.body[0] = [coords[0] + direction[0], coords[1] + direction[1]];

    return point.alive;
  }
};
