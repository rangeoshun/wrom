let _tickCallbacks = [];
let _tickSyncCallbacks = [];
let _tickSpeed = 5;
let _tickHandler = function () {
  let players = _game.players;
  if (!_game.paused) {
    if (!players.length) {
      _tickSpeed = 5;
    }
    _tickCallbacks.forEach(function ( callback, index ) {
        if (callback(players) === false) {
          _tickCallbacks.splice(index, 1);
        }
    });
  }

  let state = _game.getState();
  _tickSyncCallbacks.forEach(function ( callback, index ) {
      if (callback(state) === false) {
        _tickSyncCallbacks.splice(index, 1);
      }
  });

  _game.ditchTheDead();

  setTimeout(_tickHandler, 1000 / _tickSpeed);
};
