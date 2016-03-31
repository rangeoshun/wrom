'use strict';
const Utils = require('./utils.js');

module.exports = class Player {
  constructor () {
    const player = this;
    player.id = Utils.getUniqueID();
    player.score = 0;
  }

  manifest ( entity ) {
    const player = this;
    player.entity = entity;
    entity.id = player.id;
    entity.player = player;
  }

  setName ( name ) {
    const player = this;
    player.name = name.toString();
    player.entity.setName(player.name);
  }

  setColor ( color ) {
    const player = this;
    player.color = color;
    player.entity.setColor(color);
  }

  setConnection ( connection ) {
    const player = this;
    player.connection = connection;
  }


}
