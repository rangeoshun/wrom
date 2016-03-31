"use strict";

module.exports = class Tick {
  constructor ( game ) {
    const tick = this;
    let callbacks = [[],[],[]];
    let syncCallbacks = [];
    let tickSpeed = 19;

    tick.beforeCallbacks = callbacks[0];
    tick.onCallbacks = callbacks[1];
    tick.afterCallbacks = callbacks[2];

    tick.init = function tickHandler () {

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
              game.tick.onCallbacks.splice(index, 1);
            }
        });

        afterCallbacks.forEach(function ( callback, index ) {
            if (callback(players, points) === false) {
              game.tick.onCallbacks.splice(index, 1);
            }
        });
      }

      setTimeout(tickHandler, tickTime);
    //  console.timeEnd(`Tick takes`);
    };
  }
};
