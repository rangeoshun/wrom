class Point extends Entity {
  constructor (x, y) {
    super(x, y);
    const point = this;
    point.relocate();
    point.alive = true;
    _tickCallbacks.push(point.isColliding());
  }

  isColliding () {
    const point = this;
    return function ( players ) {
      players.forEach(function ( player ) {
        if (_isColliding(player.coords, point.coords)) {
          player.grow();
          point.die();
        }
      });

      return point.alive;
    }
  }
}
