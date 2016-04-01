"use strict";
const Pixel = require('./pixel.js');
const Point = require('./point.js');
const Globals = require('./globals.js');

module.exports = class MinePoint extends Point {
  constructor ( game ) {
    super(game);
    const point = this;
    point.value = 0;
    point.type = 'mp';
    point.armed = false;
    point.armedColor = [1,0.2,0.2];
  }

  render () {
    const point = this;
    return function () {
      const armed = point.armed;
      const sinTime = !armed ? 1 : Math.sin(parseFloat('0.'+ (new Date().getTime() / 1000).toString().split('.')[1]) * Math.PI);
      let color = !armed ? point.color : point.armedColor;

      console.log(armed)

      let pixels = [];
      let r = color[0] * sinTime;
      let g = color[1] * sinTime;
      let b = color[2] * sinTime;

      pixels.die = !point.alive;
      pixels.push(new Pixel(1, r, g, b, point.coords));

      return pixels;
    };
  }

  isColliding () {
    const point = this;
    const game = point.game;
    const coords = point.coords;
    let countLength = 4;
    let countDown = countLength;

    return function ( players ) {

      if (point.armed) {
        countDown--;
      }

      players.forEach(function ( player ) {
        const body = player.body;
        const length = body.length;

        player.body.forEach(function ( part, index ) {
          const distance = game.getDistance(part, coords);

          if (distance < 6) {
            point.armed = true;

            if (distance < 4 && !countDown) {

              console.log(`${player.constructor.name} ${player.id} is blown to peaces by ${point.constructor.name} ${point.id}`);
              const rest = length - index - 1;
              const value = rest * -10;

              if (!index) {
                player.die();
              } else {
                player.body.splice(index, rest);
                player.drop(rest);
              }

              player.addScore(value);
              point.die();
            }
          } else {
//            point.armed = false;
//            countDown = countLength;
          }
        });
      });

      return point.alive;
    }
  }
};
