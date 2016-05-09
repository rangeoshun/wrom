'use strict';
const Point = require('./point.js');
const Pixel = require('./pixel.js');
const colors = require('./colors.js');
const GhostAbility = require('./ghost-ability.js');

module.exports = class GhostPoint extends Point {
  constructor ( game ) {
    super(game);
    const point = this;
    point.value = 0;
    point.type = 'gop';
    point.color = colors.gray;
  }

  onCollision ( player ) {
    if (player.ghost) return;

    const point = this;
    const body = player.body;
    const game = player.game;

    if (game && game.server) {
      player.setAbility(GhostAbility, true);
    }
    point.die(player.id);
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

      const factor = Math.sin(parseFloat('0.'+ (new Date().getTime() / 1000).toString().split('.')[1]) * Math.PI);

      r *= factor;
      g *= factor;
      b *= factor;

      pixels.push(new Pixel(1, r, g, b, point.coords));
      return pixels;
    };
  }
}
