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

    if (game.server) {
      game.tick.onCallbacks.push(point.isColliding());
      game.tick.onCallbacks.push(point.isOutOfBounds());
    }
  }

  isOutOfBounds () {
    const point = this;
    return function () {
      if (point.isCoordOutOfBOunds(point.coords)) {
        point.die();
        return point.alive;
      }
    }
  }

  isColliding () {
    const point = this;
    const game = point.game;

    return function ( players ) {
      const coords = point.coords;

      players.forEach(function ( player ) {
        if (game.areColliding(player.coords, coords)) {
          console.log(`${player.constructor.name} ${player.id} is collecting ${point.constructor.name} ${point.id}`);
          player.grow(point.value / 10);
          player.player.score += point.value;
          point.die(player.id);
        }
      });

      return point.alive;
    }
  }
};
