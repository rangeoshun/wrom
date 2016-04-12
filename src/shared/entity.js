"use strict";
const Utils = require('./utils.js');
const Pixel = require('./pixel.js');
const Globals = require('./globals.js');
const colors = require('./colors.js');
const PickUpFX = require('./fx-pickup.js');

module.exports = class Entity {
  constructor ( game ) {
    let entity = this;
    entity.game = game;
    entity.updated = true;
    entity.coords = [0,0];
    entity.coordsUpdated = true;
    entity.id = Utils.getUniqueID();
    entity.alive = true;
    entity.aliveUpdated = true;

    entity.color = colors.white;
    entity.colorUpdated = true;
    entity.name = '';
    entity.nameUpdated = true;
    entity.type = '';
    entity.typeUpdated = true;

    entity.dieFX = !game.server ? PickUpFX : null;

    if (!game.server) {
      Globals.renderCallbacks.push(entity.render());
    }

    console.log(`${entity.constructor.name} ${entity.id} is alive`);
  }

  setCoords ( coords ) {
    let entity = this;
    entity.coords = coords;
    entity.updated = entity.nameCoords = true;
  }


  setName ( name ) {
    let entity = this;
    entity.name = name;
    entity.updated = entity.nameUpdated = true;
  }

  setColor ( color ) {
    let entity = this;
    entity.color = color;
    entity.updated = entity.colorUpdated = true;
  }

  die ( killerID ) {
    let entity = this;
    let killer = entity.game.getPlayerById(killerID);

    entity.alive = false;
    entity.killerID = killerID;
    entity.updated = entity.aliveUpdated = true;
    if (entity.dieFX && killer) new entity.dieFX(killer, entity.color);
    console.log(`${entity.constructor.name} ${entity.id} is dead`);
  }

  random ( dimension ) {
    return Math.floor(Math.random() * Globals.resolution[dimension]);
  }

  isOutOfBounds ( coords ) {
    let entity = this;
    return !entity.isCoordOutOfBOunds(entity.coords);
  }

  isCoordOutOfBOunds ( coords ) {
    if (coords[0] >= Globals.resolution[0]
      || coords[0] < 0
      || coords[1] >= Globals.resolution[1]
      || coords[1] < 0) {

      return true;
    }
    return false;
  }

  displace ( coord, by ) {
    by = by || 2;
    let entity = this;
    let x = Math.round(Math.random() * by + 1) - 1;
    let y = Math.round(Math.random() * by + 1) - 1;
    let newCoord = [coord[0] + x, coord[1] + y];

    return newCoord;
  }

  relocate () {
    let entity = this;
    entity.setCoords([entity.random(0), entity.random(1)]);
  }

  render () {
    let entity = this;
    return function () {
      const sinTime = 1;//Math.sin(parseFloat('0.'+ (new Date().getTime() / 1000).toString().split('.')[1]) * Math.PI);

      let pixels = [];
      if (!entity.game.getPointById(entity.id) || !entity.alive) {
        pixels.die = [];
        return pixels;
      }

      let r = entity.color[0] * sinTime;
      let g = entity.color[1] * sinTime;
      let b = entity.color[2] * sinTime;

      pixels.push(new Pixel(1, r, g, b, entity.coords));

      return pixels;
    };
  }
};
