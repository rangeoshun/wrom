'use strict';

module.exports = function GhostAbility ( player ) {
  const ability = this;
  const game = player.game;
  const message = 'Picked up ghost!';
  let duration = 10;
  player.setMessage(message);

  return function () {
    player.setAbility(GhostAbility, false);
    player.setGhost(true);
    player.setMessage(`You're a ghost for ${duration} seconds..`);

    let countDown = setInterval(function () {
      duration--;
      player.setMessage(`You're a ghost for ${duration} seconds..`);
      if (!duration) {
        player.setGhost(false);
        player.setMessage('');
        clearInterval(countDown);
      }
    },1000);
  };
};
