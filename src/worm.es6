class Worm extends Entity {
  constructor ( x, y ) {
    super(x, y);
    const worm = this;

    worm.direction = [];
    worm.nextDirection = false;

    worm.body = [];
    worm.size = 4;

    worm.spawn();
  }

  drop () {
    if (!_game.server) return;
    const worm = this;
    console.log(`${worm.constructor.name} ${worm.id} is dropping:`)

    worm.body.forEach(function ( partCoords ) {
      if (!Math.round(Math.random())) return;

      let point = _game.addPoint();
      point.coords = worm.displace(partCoords, 2);
    });
  }

  die () {
    const worm = this;
    if (!worm.alive) return;

    worm.drop();
    worm.alive = false;
  }

  spawn () {

    const worm = this;
    let dirX = Math.round(Math.random() * 2) - 1;
    let dirY = (dirX) ? 0 : (Math.round(Math.random())) ? -1 : 1;

    worm.alive = true;
    worm.ghost = true;
    worm.direction = [dirX, dirY];
    worm.body = [];
    worm.relocate();

    for (let i = 0; i < worm.size; i++) {
      worm.body.push([worm.coords[0] - i * worm.direction[0], worm.coords[1] - i * worm.direction[1]]);
    }

    worm.isColliding(function ( collision ) {
      if (collision) {

        console.log(`${worm.constructor.name} ${worm.id} is dying to respawn`);
        worm.spawn();

      } else {

        _tickCallbacks.push(worm.move());
        setTimeout(function () {

          worm.ghost = false;
          _tickCallbacks.push(worm.isColliding());
        }, 2000);
      }
    })(_game.players);
  }

  isColliding ( callback ) {
    const worm = this;

    return function ( players ) {
      let collision = false;

      players.forEach(function ( player, index ) {
        if (player.ghost) return;

        player.body.forEach(function ( part, index ) {
          if (player === worm && !index) return;

          if (_isColliding(worm.coords, part)) {
            console.log(`${worm.constructor.name} ${worm.id} is colliding with ${worm.constructor.name} ${player.id}`);
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

    worm.nextDirection = direction;
  }

  grow () {
    const worm = this;
    let tail = worm.body[worm.body.length - 1];
    worm.size++;
    worm.body.push([tail[0], tail[1]]);
  }

  move () {
    const worm = this;
    return function () {
      const coords = worm.coords;
      let body = worm.body;
      const head = worm.body[0];
      let tail = worm.body[worm.body.length - 1];
      let direction = worm.direction;
      const nextDirection = worm.nextDirection;

      if (nextDirection && nextDirection[0] !== direction[0] * -1
        && nextDirection[1] !== direction[1] * -1) {
        worm.direction = nextDirection;
      }

      tail[0] = coords[0] = head[0] + direction[0];
      tail[1] = coords[1] = head[1] + direction[1];

      if (tail[0] >= _resolution[0]) {
        tail[0] -= _resolution[0];
      } else if (tail[0] < 0) {
        tail[0] = _resolution[0];
      }

      if (tail[1] >= _resolution[1]) {
        tail[1] -= _resolution[1];
      } else if (tail[1] < 0) {
        tail[1] = _resolution[1];
      }

      body.unshift(body.pop());

      return worm.alive;
    };
  }

  render () {
    const worm = this;
    return function ( pixel ) {
      if (!worm.alive) return;

      worm.body.forEach(function ( part ) {

        let r;
        let g;
        let b;

        if (pixel[4][0] === part[0] && pixel[4][1] === part[1]) {

          if (worm.client) {

            r = 0.5;
            g = 1;
            b = 0.5;

          } else {

            r = 1;
            g = 0.5;
            b = 0.5;
          }

          if (worm.ghost) {
            const factor = Math.sin(parseFloat('0.'+ (new Date().getTime() / 1000).toString().split('.')[1]) * Math.PI);
            r *= factor;
            g *= factor;
            b *= factor;
          }

          pixel[1] = r;
          pixel[2] = g;
          pixel[3] = b;
        }
      });

      return worm.alive;
    };
  }
}
