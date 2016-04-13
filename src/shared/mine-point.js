"use strict";
const Pixel = require('./pixel.js');
const Point = require('./point.js');
const colors = require('./colors.js');
const MineFX = require('./mine-fx.js');

module.exports = class MinePoint extends Point {
  constructor ( game ) {
    super(game);
    const point = this;
    point.value = 0;
    point.type = 'mnp';
    point.typeUpdated = true;
    point.armedColor = [1,0.2,0.2];
    point.color = point.armedColor;
    point.armed = false;
    point.armedUpdated = true;
    point.countLength = 5;
    point.countDown = point.countLength;
    point.blowRadius = 5;

    setTimeout(function () {
      const factor = Math.round(Math.random() * 10);
      if (factor > 7) {
        point.color = colors.gold;
      } else {
        point.color = colors.white;
      }
    }, 1000);
  }

  render () {
    let point = this;
    const game = point.game;
    return function ( screen ) {
      const armed = point.armed;

      let pixels = [];
      if (!game.getPointById(point.id) || !point.alive) {
        pixels.die = [];
        return pixels;
      }

      const color = !armed && game.globals.selfID !== point.creator ? point.color : point.armedColor;
      pixels.push(new Pixel(1, 1, 1, 1, point.coords).setColor(color));

      return pixels;
    };
  }

  arm () {
    const point = this;

    if (!point.armed) {
      if (!point.game.server) new MineFX(point);
      point.armed = true;
      point.armedUpdated = true;
      point.updated = true;
    }
  }

  onCollision ( player, bodyIndex, scorerID ) {
    const point = this;
    const length = player.body.length;
    const rest = length - bodyIndex - 1;
    const scorer = player.game.getPlayerById(scorerID);
    if (scorer) scorer.addScore(rest * 10);

    if (!bodyIndex) {
      player.die();
    } else {
      player.drop(rest, bodyIndex, player.body.splice(bodyIndex, rest));
    }

  }

  isColliding () {
    const point = this;
    const game = point.game;

    return function ( players ) {
      const coords = point.coords;
      const scorerID = point.creator;

      if (point.armed) {
        point.countDown--;
      }
      const countDown = point.countDown;

      players.forEach(function ( player ) {
        if (player.id === point.creator) return point.alive;
        const body = player.body;

        player.body.forEach(function ( part, index ) {
          if (player.ghost) return;

          const distance = game.getDistance(part, coords);

          if (distance < point.blowRadius
            && (part[0] === coords[0]
              || part[1] === coords[1])) {

            point.arm();

            if (!point.countDown) {

              console.log(`${player.constructor.name} ${player.id} is blown to peaces by ${point.constructor.name} ${point.id}`);
              point.onCollision(player, index, scorerID);
            }
          }
        });
      });

      if (!countDown) point.die(1);
      return point.alive;
    }
  }
};
