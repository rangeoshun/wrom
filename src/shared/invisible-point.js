'use strict';
const Point = require('./point.js');
const Pixel = require('./pixel.js');
const colors = require('./colors.js');
const InvisibleAbility = require('./invisible-ability.js');

module.exports = class InvisiblePoint extends Point {
  constructor ( game ) {
    super(game);
    const point = this;
    point.value = 0;
    point.type = 'ivp';
    point.color = colors.lightBlue;
  }

  onCollision ( player ) {
    const point = this;
    const body = player.body;
    const game = player.game;

    point.die(player.id);
    if (game.server) {
      player.setAbility(new InvisibleAbility(player));
    }
  }

  render () {
    const point = this;
    return function () {
      let pixels = [];

      if (!point || !point.alive) {
        pixels.die = true;
        return pixels;
      }

      let r = point.color[0];
      let g = point.color[1];
      let b = point.color[2];

      const factor = Math.sin(new Date().getMilliseconds() / 1000) + 0.2;

      r *= factor;
      g *= factor;
      b *= factor;

      pixels.push(new Pixel(1, r, g, b, point.coords));
      return pixels;
    };
  }
}
