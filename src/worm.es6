class Worm extends Entity {
  constructor ( x, y ) {
    super(x, y);
    const worm = this;
    worm.body = [];
    worm.size = 3;
    worm.direction = [1, 0];
    worm.directionCue = [];
    worm.alive = false;

    _tickCallbacks.push(worm.move());
    _tickCallbacks.push(worm.isColliding());

    worm.spawn();
  }

  spawn () {

    const worm = this;
    worm.body = [];
    worm.relocate();

    for (let i = 0; i < worm.size; i++) {
      worm.body.push([worm.coords[0] - i, worm.coords[1]]);
    }

    if (worm.isColliding()()) {

      worm.die();
      worm.spawn();

    } else {
      worm.alive = true;
    }
  }

  die () {
    const worm = this;
    worm.alive = false;
    console.log(worm.id + ' is dead.');
  }

  isColliding () {
    const worm = this;
    return function () {
      _game.players.forEach(function ( player, index ) {
        player.body.forEach(function ( part, index ) {
          if (player === worm && !index) { return; }
          if (_isColliding(worm.coords, part)) {
            worm.die();
          }
        });
      });
    }
  }

  setDirection ( direction ) {
    const worm = this;
    if (direction[0] === worm.direction [0] * -1
      && direction[1] === worm.direction [1] * -1) {
      return;
    }

    worm.directionCue.push(direction);
  }

  grow () {
    const worm = this;
    let wormTail = worm.body[worm.body.length - 1];
    worm.size++;
    worm.body.push([wormTail[0], wormTail[1]]);
  }

  move () {
    const worm = this;
    return function () {
      let wormHead = worm.body[0];
      let wormTail = worm.body[worm.body.length - 1];
      if (worm.directionCue.length) {
        worm.direction = worm.directionCue.shift();
      }
      wormTail[0] = worm.coords[0] = wormHead[0] + worm.direction[0];
      wormTail[1] = worm.coords[1] = wormHead[1] + worm.direction[1];

      if (wormTail[0] >= _resolution[0]) {
        wormTail[0] -= _resolution[0];
      } else if (wormTail[0] < 0) {
        wormTail[0] = _resolution[0];
      }

      if (wormTail[1] >= _resolution[1]) {
        wormTail[1] -= _resolution[1];
      } else if (wormTail[1] < 0) {
        wormTail[1] = _resolution[1];
      }

      worm.body.unshift(worm.body.pop());

      return worm.alive;
    };
  }

  render () {
    const worm = this;
    return function ( pixel ) {
      if (!worm.alive) return;

      worm.body.forEach(function ( part ) {
        if (pixel.x() === part[0] && pixel.y() === part[1]) {
          pixel[1] = pixel[2] = pixel[3] = worm.alive ? 1 : 0;
        }
      });

      return worm.alive;
    };
  }
}
