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
    player.body[0] = [coords[0] + direction[0] * 3, coords[1] + direction[1] * 3];

    return point.alive;
  }

  isColliding () {
    let point = this;

    return function ( players ) {
      const game = point.game;
      const coords = point.coords;
      const color = point.color;
      players.forEach(function ( player ) {
        if (game.areColliding(player.coords, coords, false)) {
          console.log(`${player.constructor.name} ${player.id} is collecting ${point.constructor.name} ${point.id}`);
          point.onCollision(player);
        }
      });

      return game.server &&point.alive;
    };
  }
};
