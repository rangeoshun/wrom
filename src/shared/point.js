"use strict";
const Entity = require('./entity.js');

module.exports = class Point extends Entity {
  constructor ( game ) {
    super(game);
    const point = this;
    point.relocate();
    point.alive = true;
    point.value = 10;
    point.type = 'p';

    game.tick.onCallbacks.push(point.isColliding());
  }

  isColliding () {
    const point = this;
    const game = point.game;
    const coords = point.coords;

    return function ( players ) {
      players.forEach(function ( player ) {
        if (game.areColliding(player.coords, coords)) {
          console.log(`${player.constructor.name} ${player.id} is collecting ${point.constructor.name} ${point.id}`);
          player.grow(point.value / 10);
          player.player.score += point.value;
          point.die();
        }
      });

      return point.alive;
    }
  }
};
