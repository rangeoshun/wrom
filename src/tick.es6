let _tickCallbacks = [];
let _tickSyncCallbacks = [];
let _tickSpeed = 5;
let _tickHandler = function () {
  if (!_game.paused) {
    if (!_game.players.length && _tickSpeed != 5) {
      _tickSpeed = 5;
    }
    _tickCallbacks.forEach(function ( callback, index ) {
        if (callback() === false) {
          console.log('delete');
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

  setTimeout(_tickHandler, 1000 / _tickSpeed);
};
