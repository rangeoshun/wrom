"use strict";
const Globals = require('./globals.js');
const Tick = require('./tick.js');
const Point = require('./point.js');
const GoldenPoint = require('./golden-point.js');
const Worm = require('./worm.js');

module.exports = class Game {
  constructor () {
    const game = this;
    let points = game.points = [];
    let players = game.players = [];
    let syncCallbacks = game.syncCallbacks = [];
    let tick = game.tick = new Tick(game);
    game.previousState = {};
    game.paused = false;

    function correctPoints () {
      if (game.points.length < Math.round(game.players.length / 2)) {
        game.addPoint();
      }
    }

    function cleanup () {
      //  console.timeEnd(`Sync takes`);
        game.ditchTheDead();
    }

    function syncPlayers ( player ) {
      //  console.time(`Sync takes`);
      let state = game.getState();
      game.syncCallbacks.forEach(function ( callback, index ) {
        if (callback.del) {
          game.syncCallbacks.splice(index, 1);
          return;
        }

        if (callback(state) === false) {
          callback.del = true;
        }
      });
    }

    tick.afterCallbacks.push(syncPlayers);
    tick.afterCallbacks.push(cleanup);
    tick.afterCallbacks.push(correctPoints);
  }

  togglePause () {
    const game = this;
    game.paused = !game.paused;
  }

  getRandomPoint () {
    const factor = Math.round(Math.random() * 10);
    if (factor > 9) {
      return GoldenPoint;
    } else {
      return Point;
    }
  }

  addPoint ( type ) {
    const game = this;
    const Type = type || game.getRandomPoint();
    let point = new Type(game);

    game.points.push(point);

    return point;
  }

  addPlayer () {
    const game = this;
    let player = new Worm(game);

    game.players.push(player);

    return player;
  }

  getPointById ( id ) {
    const game = this;
    let foundPoint = null;

    game.points.forEach(function ( point ) {
      if (id !== point.id) return;
      foundPoint = point;
    });

    return foundPoint;
  }

  getPlayerById ( id ) {
    const game = this;
    let foundPlayer = null;

    game.players.forEach(function ( player ) {
      if (id !== player.id) return;
      foundPlayer = player;
    });

    return foundPlayer;
  }

  getState ( fullState ) {
    const game = this;
    let state = {};

    game.points.forEach(function ( point ) {
      if (!fullState && point.updated === false) return;
      if (!state.hasOwnProperty('pi')) state.pi = {};
      let pointState = {};

      if (point.alive) {
        pointState.tp = point.type;
        pointState.co = point.coords;
      } else {
        pointState.de = true;
      }

      state.pi[point.id] = pointState;
      point.updated = false;
    });

    game.players.forEach(function ( player ) {
      if (!fullState && player.updated === false) return;
      if (!state.hasOwnProperty('pa')) state.pa = {};
      let playerState = {};

      if (player.alive) {
        playerState.cl = player.color;
        playerState.bd = player.body;
        playerState.so = player.player.score;
        playerState.nm = player.player.name;
        if (player.ghost) playerState.go = player.ghost;
      } else {
        playerState.so = player.player.score;
        playerState.nm = player.player.name;
        playerState.de = true;
      }

      state.pa[player.id] = playerState;
      player.updated = false;
    });

    return state;
  }

  ditchTheDead () {
    const game = this;

    game.points = game.points.filter(function ( point ) {
      return point ? point.alive : false;
    });
    game.players = game.players.filter(function ( player ) {
      return player ? player.alive : false;
    });
  }

  areColliding ( v1, v2 ) {
    return v1[0] === v2[0] && v1[1] === v2[1];
  }

  init ( server ) {
    const game = this;
    if (server) {
      game.server = true;
      game.tick.init();
    }
  }
};
