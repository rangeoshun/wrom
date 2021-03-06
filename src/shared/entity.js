"use strict";
const Utils = require('./utils.js');
const Pixel = require('./pixel.js');
const Globals = require('./globals.js');
const colors = require('./colors.js');
const CreateFX = require('./create-fx.js');
const PickUpFX = require('./pickup-fx.js');
const PickupBeamFX = require('./pickup-beam.js');
/*
const Point = require('./point.js');
const GoldenPoint = require('./golden-point.js');
*/
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

  setCreator ( creatorID ) {
    const point = this;
    point.creator = creatorID;
    point.updated = point.creatorUpdated = true;
  }

  setCoords ( coords ) {
    let entity = this;
    entity.coords = coords;
    entity.updated = entity.coordsUpdated = true;
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

    if (killer) new PickupBeamFX(killer, entity.coords, entity.color);
    entity.setCoords([-1,-1]);
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
    const entity = this;
    const pixels = [];
    return function () {
      const sinTime = 1;//Math.sin(parseFloat('0.'+ (new Date().getTime() / 1000).toString().split('.')[1]) * Math.PI);

      if (!entity.alive) {
        pixels.die = true;
        pixels.splice(0);
        return pixels;
      }

      if (!pixels[0]) pixels.push(new Pixel());
      let pixel = pixels[0];

      let r = entity.color[0] * sinTime;
      let g = entity.color[1] * sinTime;
      let b = entity.color[2] * sinTime;

      pixel[1] = r;
      pixel[2] = g;
      pixel[3] = b;
      pixel.setCoords(entity.coords);

      return pixels;
    };
  }
};
