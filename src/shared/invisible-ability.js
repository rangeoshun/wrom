'use strict';

module.exports = function InvisibleAbility ( player ) {
  const ability = this;
  const game = player.game;
  const message = 'Picked up invisibleity!';
  let duration = 10;
  player.setMessage(message);

  return function () {
//    new InvisibleFX(player);
    player.setInvisible(1);

    player.setAbility(InvisibleAbility, false);
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
