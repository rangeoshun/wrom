'use strict';
const Point = require('./point.js');
const colors = require('./colors.js');
const PickupMineAbility = require('./pickup-mine-ability.js');

module.exports = class PickupMinePoint extends Point {
  constructor ( game ) {
    super(game);
    const point = this;
    point.value = 0;
    point.type = 'pcp';
    point.color = colors.purple;
  }

  onCollision ( player ) {
    const point = this;
    const body = player.body;
    const game = player.game;

    point.die(player.id);
    if (game.server) {
      player.setAbility(new PickupMineAbility(player));
    }
  }
}
