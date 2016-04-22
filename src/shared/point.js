"use strict";
const Entity = require('./entity.js');
const CreateFX = require('./create-fx.js');

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
      game.tick.afterCallbacks.push(point.isOutOfBounds());
    }

    new CreateFX(point);
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

  onCollision ( player ) {
    const point = this;
    const game = point.game;

    player.grow(point.value / 10);
    if (game.server) player.player.score += point.value;
    point.die(player.id);
  }

  isColliding () {
    let point = this;
    const server = point.game.server;

    return function ( players ) {
      const game = point.game;
      const coords = point.coords;
      const color = point.color;
      const playersLength = players.length;
      for (var i = 0; i < playersLength; i++) {
        const player = players[i];
        if (game.areColliding(player.coords, coords, false, player)) {
          console.log(`${player.constructor.name} ${player.id} is collecting ${point.constructor.name} ${point.id}`);
          point.onCollision(player);
        }
      };


      return game.server &&point.alive;
    };
  }
};
