let _tickCallbacks = [];
let _tickSyncCallbacks = [];
let _tickSpeed = 19;
let _tickHandler = function () {
  let tickTime = parseInt(1000 / _tickSpeed);
  setTimeout(_tickHandler, tickTime);
//  console.log(`Tick should take max: ${tickTime}ms`);
//  console.time(`Tick takes`);
  let players = _game.players;
  let points = _game.points;
  if (!_game.paused) {
    _tickCallbacks.forEach(function ( callback, index ) {
        if (callback(players) === false) {
          _tickCallbacks.splice(index, 1);
        }
    });
  }
//  console.timeEnd(`Tick takes`);

//  console.time(`Sync takes`);
  let state = _game.getState();
  _tickSyncCallbacks.forEach(function ( callback, index ) {
    if (callback.del) {
      _tickSyncCallbacks.splice(index, 1);
      return;
    }

    if (callback(state) === false) {
      callback.del = true;
    }
  });

  if (points.length < Math.round(players.length / 2)) {
    _game.addPoint();
  }

//  console.timeEnd(`Sync takes`);
  _game.ditchTheDead();
};
