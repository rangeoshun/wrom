'use strict';
const colors = require('./colors.js');
const PortalIOPoint = require('./portal-io-point.js');

module.exports = function PortalAbility ( player ) {
  const game = player.game;
  const message = 'Press [SPACE] to open portal!';
  let init = 0;
  let duration = 7;

  player.setMessage(message);

  return function () {
    player.setAbility(null);

    player.setMessage(`You'have portal open for ${duration} seconds..`);
    const head = player.body[0];
    const direction = player.direction;
    const scorer = player.id;
    let portal0 = game.addPoint(PortalIOPoint);
    let portal1 = game.addPoint(PortalIOPoint);

    portal0.pair = portal1;
    portal0.setColor(colors.orange);
    portal0.setCoords([head[0] + direction[0] * 7, head[1] + direction[1] * 7]);

    portal1.pair = portal0;
    portal1.setColor(colors.cyan);


    let countDown = setInterval(function () {
      duration--;
      player.setMessage(`You'have portal open for ${duration} seconds..`);

      if (!duration) {
        player.setMessage('');
        clearInterval(countDown);

        game.tick.onCallbacks.push(function ( players ) {

          players.forEach(function ( player ) {
            const body = player.body;
            const length = body.length;

            body.forEach(function ( part, index ) {
              const distance1 = game.getDistance(part, portal1.coords);

              if (distance1 < 2
                && (part[0] === portal1.coords[0]
                  || part[1] === portal1.coords[1])) {

                console.log(`${player.constructor.name} ${player.id} is thorn into half by ${portal1.constructor.name} ${portal1.id}`);
                const rest = length - index;

                if (!index) {
                  player.die();
                } else {
                  player.drop(rest, index, body.splice(index, rest));
                }

                if (player.id !== scorer) point.game.getPlayerById(scorer).addScore(rest * 10);
              }
            });
          });

          return false;
        });

        portal0.die(1);
        portal1.die(1);
      }
    },1000);
  };
};
