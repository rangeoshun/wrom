class Point extends Entity {
  constructor (x, y) {
    super(x, y);
    const point = this;
    point.relocate();
    point.alive = true;
    point.value = 10;
    point.type = 'p';

    _tickCallbacks.push(point.isColliding());
  }

  isColliding () {
    const point = this;
    return function ( players ) {
      players.forEach(function ( player ) {
        if (_isColliding(player.coords, point.coords)) {
          console.log(`${player.constructor.name} ${player.id} is collecting ${point.constructor.name} ${point.id}`);
          player.grow();
          player.addScore(point.value);
          point.die();
        }
      });

      return point.alive;
    }
  }
}
