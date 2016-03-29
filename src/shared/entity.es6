"use strict";
const Utils = require('./utils.js');
const Pixel = require('./pixel.js');
const Globals = require('./globals.js');

module.exports = class Entity {
  constructor ( game ) {
    const entity = this;
    entity.game = game;
    entity.coords = [0,0];
    entity.id = Utils.getUniqueID();
    entity.alive = true;
    entity.updated = true;
    entity.color = [1,1,1];
    entity.type = '';

    if (!game.server) {
      Globals.renderCallbacks.push(entity.render());
    }
    console.log(`${entity.constructor.name} ${entity.id} is alive`);
  }

  setColor ( color ) {
    const entity = this;
    entity.color = color;
    entity.updated = true;
  }

  die () {
    const entity = this;
    entity.alive = false;
    entity.updated = true;
    console.log(`${entity.constructor.name} ${entity.id} is dead`);
  }

  random ( dimension ) {
    return Math.floor(Math.random() * Globals.resolution[dimension]);
  }

  isCoordOutOfBOunds ( coord ) {
    if (coord[0] >= Globals.resolution[0]
      || coord[0] < 0
      || coord[1] >= Globals.resolution[1]
      || coord[1] < 0) {

      return true;
    }
    return false;
  }

  displace ( coord, by = 2 ) {
    const entity = this;
    let x = Math.round(Math.random() * by + 1) - 1;
    let y = Math.round(Math.random() * by + 1) - 1;
    let newCoord = [coord[0] + x, coord[1] + y];

    if (entity.isCoordOutOfBOunds(newCoord)) {
      newCoord = [coord[0] + x * -1, coord[1] + y * -1];
    }

    return newCoord;
  }

  relocate () {
    const entity = this;
    entity.coords = [entity.random(0), entity.random(1)];
    entity.updated = true;
  }

  render () {
    const entity = this;
    return function () {
      const sinTime = 1;//Math.sin(parseFloat('0.'+ (new Date().getTime() / 1000).toString().split('.')[1]) * Math.PI);

      let pixels = [];
      let r = entity.color[0] * sinTime;
      let g = entity.color[1] * sinTime;
      let b = entity.color[2] * sinTime;

      pixels.die = !entity.alive;
      pixels.push(new Pixel(1, r, g, b, entity.coords));

      return pixels;
    };
  }
};
