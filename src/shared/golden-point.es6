"use strict";
const Point = require('./point.js');

module.exports = class GoldenPoint extends Point {
  constructor ( game ) {
    super(game);
    const point = this;
    point.relocate();
    point.alive = true;
    point.value = 50;
    point.color = [1,0.8,0];
    point.type = 'gp';

    game.tick.onCallbacks.push(point.isColliding());
  }
};
