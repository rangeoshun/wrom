let _tickCallbacks = [];
let _tickSyncCallbacks = [];
let _tickSpeed = 5;
let _maxTickSpeed = 25;
let _tickHandler = function () {
  let tickTime = parseInt(1000 / _tickSpeed);
  setTimeout(_tickHandler, tickTime);
//  console.log(`Tick should take max: ${tickTime}ms`);
//  console.time(`Tick takes`);
  let players = _game.players;
  if (!_game.paused) {
    if (!players.length || _tickSpeed > _maxTickSpeed) {
      _tickSpeed = 5;
    }
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
      if (callback(state) === false) {
        _tickSyncCallbacks.splice(index, 1);
      }
  });
//  console.timeEnd(`Sync takes`);
  _game.ditchTheDead();
};
