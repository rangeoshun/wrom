'use strict';

module.exports = function DrillAbility ( player ) {
  const ability = this;
  const game = player.game;
  const message = 'Picked up drill head!';
  let duration = 10;
  player.setMessage(message);

  return function () {

    player.setDrill(1);

    player.setAbility(DrillAbility, false);
    player.setMessage(`Drill head active for ${duration} seconds..`);

    game.tick.onCallbacks.push(function ( players ) {
      const head = player.body[0];

      players.forEach(function ( enemy ) {

        const body = enemy.body;
        const length = body.length;

        body.forEach(function ( part, index ) {
          if ((!index && enemy.id === player.id) || enemy.ghost) return;

          if (player.body.length && part[0] === head[0]
            && part[1] === head[1]) {

            player.setMessage(`${enemy.constructor.name} ${enemy.id} is thorn into half by ${player.constructor.name} ${player.id}`);
            const rest = length - index;

            if (!index) {
              enemy.die();
            } else {
              enemy.drop(rest, index, body);
              body.splice(index);
            }

            if (enemy.id !== player.id) player.addScore(rest * 10);
          }
        });
      });

      return player.alive && duration > 0;
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
