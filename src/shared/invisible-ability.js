'use strict';

module.exports = function InvisibleAbility ( player ) {
  const game = player.game;
  const message = 'Press [SPACE] to become a mostly invisible for a while!';
  let duration = 10;
  player.setMessage(message);

  return function () {
//    new InvisibleFX(player);
    player.setInvisible(1);

    player.setAbility(null);
    player.setMessage(`You're a mostly invisible for ${duration} seconds..`);

    let countDown = setInterval(function () {
      duration--;
      player.setMessage(`You're a mostly invisible for ${duration} seconds..`);
      if (!duration) {
        player.setInvisible(0);
        player.setMessage('');
        clearInterval(countDown);
      }
    },1000);
  };
};
