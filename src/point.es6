class Point extends Entity {
  constructor (x, y) {
    super(x, y);
    const point = this;
    point.relocate();
    _tickCallbacks.push(point.isColliding());
  }

  isColliding () {
    const point = this;
    return function () {
      _game.players.forEach(function ( player ) {
        if (_isColliding(player.coords, point.coords)) {
          player.grow();
          point.relocate();
          _tickSpeed++;
        }
      });
    }
  }
}
