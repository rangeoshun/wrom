"use strict";
const Pixel = require('./pixel.js');
const Point = require('./point.js');
const blowUpFX = require('./fx-blowup.js');
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
    point.armedColor = [1,0.2,0.2];
    point.countLength = 5;
    point.countDown = point.countLength;
    point.blowRadius = 5;

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

  arm () {
    const point = this;

    if (!point.armed) {
      if (!point.game.server) new blowUpFX(point);
      point.armed = true;
      point.armedUpdated = true;
      point.updated = true;
    }
  }

  isColliding () {
    const point = this;
    const game = point.game;

    return function ( players ) {
      const coords = point.coords;
      if (point.armed) {
        point.countDown--;
      }
      const countDown = point.countDown;

      players.forEach(function ( player ) {
        const body = player.body;
        const length = body.length;

        player.body.forEach(function ( part, index ) {
          const distance = game.getDistance(part, coords);

          if (distance < point.blowRadius
            && (part[0] === coords[0]
              || part[1] === coords[1])) {

            point.arm();

            if (!point.countDown) {

              console.log(`${player.constructor.name} ${player.id} is blown to peaces by ${point.constructor.name} ${point.id}`);
              const rest = length - index - 1;
              if (!index) {
                player.die();
              } else {
                player.drop(rest, index, player.body.splice(index, rest));
              }
            }
          }
        });
      });

      if (!countDown) point.die(1);
      return point.alive;
    }
  }
};
