'use strict';

module.exports = function DrillAbility ( player ) {
  const game = player.game;
  const message = 'Press [SPACE] to activate drill head!';
  let duration = 10;
  player.setMessage(message);

  return function () {
//    new InvisibleFX(player);
    player.setDrill(1);

    player.setAbility(null);
    player.setMessage(`Drill head active for ${duration} seconds..`);

    game.tick.onCallbacks.push(function ( players ) {
      const head = player.body[0];

      players.forEach(function ( enemy ) {

        const body = enemy.body;
        const length = body.length;

        body.forEach(function ( part, index ) {
          if (!index && enemy.id === player.id) return;

          if (part[0] === head[0]
            && part[1] === head[1]) {

            console.log(`${enemy.constructor.name} ${enemy.id} is thorn into half by ${player.constructor.name} ${player.id}`);
            const rest = length - index;

            if (!index) {
              enemy.die();
            } else {
              enemy.drop(rest, index, body.splice(index, rest));
            }

            player.addScore(rest * 10);
          }
        });
      });
    });

    let countDown = setInterval(function () {
      duration--;
      player.setMessage(`Drill head active for ${duration} seconds..`);
      if (!duration) {
        player.setDrill(0);
        player.setMessage('');
        clearInterval(countDown);
      }
    },1000);
  };
};
