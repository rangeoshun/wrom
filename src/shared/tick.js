"use strict";

module.exports = class Tick {
  constructor ( game ) {
    const tick = this;
    const server = game.server;
    let callbacks = [[],[],[]];
    let syncCallbacks = [];
    let tickSpeed = 60;

    tick.beforeCallbacks = callbacks[0];
    tick.onCallbacks = callbacks[1];
    tick.afterCallbacks = callbacks[2];

    tick.init = tick.step = function tickHandler ( server ) {

      let tickTime = parseInt(1000 / tickSpeed);
      let beforeCallbacks = callbacks[0];
      let onCallbacks = callbacks[1];
      let afterCallbacks = callbacks[2];

    //  console.log(`Tick should take max: ${tickTime}ms`);
    //  console.time(`Tick takes`);
      let players = game.players;
      let points = game.points;
      if (!game.paused) {

        beforeCallbacks.forEach(function ( callback, index ) {
            if (callback(players, points) === false) {
              beforeCallbacks.splice(index, 1);
            }
        });

        onCallbacks.forEach(function ( callback, index ) {
            if (callback(players, points) === false) {
              onCallbacks.splice(index, 1);
            }
        });

        afterCallbacks.forEach(function ( callback, index ) {
            if (callback(players, points) === false) {
              afterCallbacks.splice(index, 1);
            }
        });
      }

      if (server) setTimeout(function () {
        tickHandler(server);
      }, tickTime);
    //  console.timeEnd(`Tick takes`);
    };
  }
};
