'use strict';

module.exports = function PickupMineAbility ( player ) {
  const game = player.game;
  const message = 'Press [SPACE] to become a ghost for a while!';
  let duration = 10;
  player.setMessage(message);

  return function () {
    player.setAbility(null);
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
