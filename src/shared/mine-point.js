"use strict";
const Pixel = require('./pixel.js');
const Point = require('./point.js');
const colors = require('./colors.js');

module.exports = class MinePoint extends Point {
  constructor ( game ) {
    super(game);
    const point = this;
    point.value = 0;
    point.type = 'mp';
    point.typeUpdated = true;
    point.armed = false;
    point.armedUpdated = true;
    point.blowRadius = 5;
    point.armedColor = [1,0.2,0.2];

    const factor = Math.round(Math.random() * 10);
    if (factor > 7) {
      point.color = colors.gold;
    }
  }

  render () {
    const point = this;

    return function ( screen ) {
      const armed = point.armed;
      const sinTime = 1;//!armed ? 1 : Math.sin(parseFloat('0.'+ (new Date().getTime() / 1000).toString().split('.')[1]) * Math.PI);
      let color = !armed ? point.color : point.armedColor;
      let r = color[0] * sinTime;
      let g = color[1] * sinTime;
      let b = color[2] * sinTime;

      let pixels = [new Pixel(1, r, g, b, point.coords)];
      pixels.die = !point.alive;

      return pixels;
    };
  }

  isColliding () {
    const point = this;
    const game = point.game;
    const countLength = 5;
    let countDown = countLength;

    return function ( players ) {
      const coords = point.coords;

      if (point.armed) {
        countDown--;
      }

      players.forEach(function ( player ) {
        const body = player.body;
        const length = body.length;

        player.body.forEach(function ( part, index ) {
          const distance = game.getDistance(part, coords);

          if (distance < point.blowRadius + 2) {
            point.armed = true;
            point.armedUpdated = true;
            point.updated = true;

            if (distance < point.blowRadius && !countDown) {

              console.log(`${player.constructor.name} ${player.id} is blown to peaces by ${point.constructor.name} ${point.id}`);
              const rest = length - index - 1;
              const value = rest * -10;

              if (!index) {
                player.die();
              } else {
                player.drop(rest, index, player.body.splice(index, rest));
              }

              player.addScore(value);
            }
          }
        });
      });
      if (!countDown) point.die();
      return point.alive;
    }
  }
};
