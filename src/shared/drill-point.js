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

    if (game && game.server) {
      player.setAbility(DrillAbility, true);
    }
    point.die(player.id);
  }

  render () {
    const point = this;
    let pixels = [new Pixel()];

    return function () {

      if (!point.alive) {
        pixels.die = [];
        return pixels;
      }

      let factor = Math.sin((new Date().getMilliseconds() / 1000) / 10) + 0.2;

      pixels[0].setCoords(point.coords).setColor(point.color, factor);
      return pixels;
    };
  }
}
