'use strict';
const Point = require('./point.js');
const Pixel = require('./pixel.js');
const colors = require('./colors.js');
const PortalAbility = require('./portal-ability.js');

module.exports = class PortalPoint extends Point {
  constructor ( game ) {
    super(game);
    const point = this;
    point.value = 0;
    point.type = 'prp';
  }

  onCollision ( player ) {
    const point = this;
    const game = player.game;

    if (game && game.server) {
      player.setAbility(PortalAbility, true);
    }
    point.die(player.id);
  }

  render () {
    const point = this;
    return function () {
      let pixels = [];

      if (!point.alive) {
        pixels.die = [];
        return pixels;
      }

      const colorState = Math.round(new Date().getMilliseconds() / 1000);

      if (colorState) point.setColor(colors.orange);
      else point.setColor(colors.cyan);

      const color =  point.color;

      pixels.push(new Pixel(1, 0, 0, 0, point.coords).setColor(color));
      return pixels;
    };
  }
}
