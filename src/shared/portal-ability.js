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
    if (init) return;
    init++;

    player.setMessage(`You'have portal open for ${duration} seconds..`);
    const head = player.body[0];
    const direction = player.direction;
    const portal0 = game.addPoint(PortalIOPoint);
    const portal1 = game.addPoint(PortalIOPoint);

    portal0.pair = portal1;
    portal0.direction = direction[0] ? [1, 0] : [0, 1];
    portal0.setColor(colors.orange);
    portal0.setCoords([head[0] + direction[0] * 5, head[1] + direction[1] * 5]);
    portal1.pair = portal0;
    portal1.setColor(colors.cyan);
    player.setAbility(null);
    portal0.direction = [direction[0] ? direction[0] : direction[1], direction[1] ? direction[1] : direction[0]]
//    portal0.setCoords();

    let countDown = setInterval(function () {
      duration--;
      player.setMessage(`You'have portal open for ${duration} seconds..`);
      if (!duration) {
//        player.setGhost(false);
        portal0.die(1);
        portal1.die(1);
        player.setMessage('');
        clearInterval(countDown);

        player.game.players.forEach(function ( player ) {
          const body = player.body;

          player.body.forEach(function ( part, index ) {

            if ((part[0] === portal0.coords[0]
              && part[1] === portal0.coords[1])) {

              console.log(`${player.constructor.name} ${player.id} is thorn int two by ${point.constructor.name} ${point.id}`);

              if (!bodyIndex) {
                player.die();
              } else {
                player.drop(rest, bodyIndex, player.body.splice(bodyIndex, rest));
              }
            }
          });
        });
      }
    },1000);
  };
};
