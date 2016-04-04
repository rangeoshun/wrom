"use strict";
const Point = require('./point.js');
const colors = require('./colors.js');

module.exports = class GoldenPoint extends Point {
  constructor ( game ) {
    super(game);
    const point = this;
    point.alive = true;
    point.value = 50;
    point.color = colors.gold;
    point.type = 'glp';

    game.tick.onCallbacks.push(point.isColliding());
  }
};
