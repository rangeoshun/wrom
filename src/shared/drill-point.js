'use strict';
const Point = require('./point.js');
const Pixel = require('./pixel.js');
const colors = require('./colors.js');
const DrillFX = require('./drill-fx.js');
const DrillAbility = require('./drill-ability.js');

module.exports = class DrillPoint extends Point {
  constructor ( game ) {
    super(game);
    const point = this;
    point.value = 0;
    point.type = 'dip';
    point.color = colors.orange;
  }

  onCollision ( player ) {
    const point = this;
    const body = player.body;
    const game = player.game;

    point.die(player.id);
    if (game.server) {
      player.setAbility(new DrillAbility(player));
    }
  }

  render () {
    const point = this;
    return function () {
      let pixels = [];

      if (!point.alive) {
        pixels.die = true;
        return pixels;
      }

      let factor = Math.sin((new Date().getMilliseconds() / 1000) / 10) + 0.2;

      pixels.push(new Pixel(0,0,0,0, point.coords).setColor(point.color, factor));
      return pixels;
    };
  }
}
