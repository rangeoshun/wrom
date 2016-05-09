'use strict';
const colors = require('./colors.js');
const PortalIOPoint = require('./portal-io-point.js');

module.exports = function PortalAbility ( player ) {
  const ability = this;
  const game = player.game;
  const message = 'Picked up portal!';
  let init = 0;
  let duration = 7;

  player.setMessage(message);

  return function () {
    player.setAbility(PortalAbility, false);

    player.setMessage(`You'have portal open for ${duration} seconds..`);
    const head = player.body[0];
    const direction = player.direction;
    const scorer = player;
    const portalDistance = 13;
    let portal0 = game.addPoint(PortalIOPoint);
    let portal1 = game.addPoint(PortalIOPoint);

    portal0.pair = portal1;
    portal0.setColor(colors.orange);
    portal0.setCoords([
      head[0] + direction[0] * portalDistance,
      head[1] + direction[1] * portalDistance
    ]);

    const p0Coords = portal0.coords;
    if (p0Coords[0] >= game.globals.resolution[0]) {
      p0Coords[0] = game.globals.resolution[0] - p0Coords[0];
    } else if (p0Coords[0] < 0) {
      p0Coords[0] = game.globals.resolution[0] + p0Coords[0];
    }

    if (p0Coords[1] >= game.globals.resolution[1]) {
      p0Coords[1] = game.globals.resolution[1] - p0Coords[1];
    } else if (p0Coords[1] < 0) {
      p0Coords[1] = game.globals.resolution[1] + p0Coords[0];
    }

    portal1.pair = portal0;
    portal1.setColor(colors.cyan);
    let countDown = setInterval(function () {
      duration--;
    },1000);

    game.tick.onCallbacks.push(function ( players ) {
      if (player && player.alive) {
        player.setMessage(`You'have portal open for ${duration} seconds..`);
      }

      if (duration < 1 && portal0.alive) {
        player.setMessage('');
        clearInterval(countDown);

        players.forEach(function ( player ) {
          const body = player.body;
          const length = body.length;

          body.forEach(function ( part, index ) {
            const distance1 = game.getDistance(part, portal0.coords);
            if (distance1 < 5) {

              player.setMessage(`${player.constructor.name} ${player.id} is thorn into half by ${portal1.constructor.name} ${portal1.id}`);
              const rest = length - index;

              if (!index) {
                player.die();
              } else {
                player.drop(rest, index, body);
                body.splice(index);
              }

              if (scorer && player.id !== scorer.id) scorer.addScore(rest * 10);
            }
          });
        });

        portal0.die(1);
        portal1.die(1);
        return false;
      }
    });
  };
};
