'use strict';
const MinePoint = require('./mine-point.js');

module.exports = function PickupMineAbility ( player ) {
  const ability = this;
  const game = player.game;
  const body = player.body;
  const message = 'Picked up mine!';
  player.setMessage(message);

  return function () {
    const coords = body[body.length -1];
    const mine = game.addPoint(MinePoint);
    player.setAbility(PickupMineAbility, false);

    mine.setCoords([coords[0], coords[1]]);
    mine.setCreator(player.id);
    player.setMessage('');
  };
};
