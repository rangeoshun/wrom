class Worm extends Entity {
  constructor ( x, y ) {
    super(x, y);
    const worm = this;

    worm.direction = [];
    worm.directionCue = [];

    worm.body = [];
    worm.size = 3;
    worm.alive = false;

    worm.spawn();
  }

  spawn () {

    const worm = this;
    let dirX = Math.round(Math.random() * 2) - 1;
    let dirY = (dirX) ? 0 : (Math.round(Math.random())) ? -1 : 1;

    worm.alive = true;
    worm.direction = [dirX, dirY];
    worm.body = [];
    worm.relocate();

    for (let i = 0; i < worm.size; i++) {
      worm.body.push([worm.coords[0] - i * worm.direction[0], worm.coords[1] - i * worm.direction[1]]);
    }

    worm.isColliding(function ( collision ) {
      if (collision) {

        console.log(`${worm.id} is dying to respawn.`);
        worm.spawn();

      } else {

        _tickCallbacks.push(worm.move());
        _tickCallbacks.push(worm.isColliding());
      }
    })(_game.players);
  }

  die () {
    const worm = this;
    worm.alive = false;
    console.log(`${worm.id} is dead.`);
  }

  isColliding ( callback ) {
    const worm = this;
    return function ( players ) {
      let collision = false;

      players.forEach(function ( player, index ) {
        if (!player.alive) return;

        player.body.forEach(function ( part, index ) {
          if (player === worm && !index) return;

          if (_isColliding(worm.coords, part)) {
            console.log(`${worm.id} is colliding with ${player.id}`);
            worm.die();
            collision = true;
          }
        });
      });

      if (callback) {
        callback(collision);
      }

      return worm.alive;
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
        if (pixel[4][0] === part[0] && pixel[4][1] === part[1]) {
          if (worm.client) {

            pixel[1] = 0.5;
            pixel[2] = 1;
            pixel[1] = 0.5;
          } else {
            pixel[1] = pixel[2] = pixel[3] = 1;
          }
        }
      });

      return worm.alive;
    };
  }
}
