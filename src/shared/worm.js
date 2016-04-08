"use strict";
const Globals = require('./globals.js');
const Entity = require('./entity.js');
const Pixel = require('./pixel.js');
const InvisibleFX = require('./invisible-fx.js');
const DrillFX = require('./drill-fx.js');

module.exports = class Worm extends Entity {
  constructor ( game ) {
    super(game);
    const worm = this;
    worm.color = worm.client ? [0.5,0.5,1] : [1,0.5,0.5];
    worm.direction = [];

    worm.invisible = 0;
    worm.ghost = 0;
    worm.drill = 0;

    worm.nextDirection = false;

    worm.body = [];
    worm.size = 4;
    worm.setMessage('Good luck!');
    worm.spawn();
  }

  isImmune () {
    const worm = this;
    return worm.ghost || worm.drill || false;
  }

  setDrill ( state ) {
    const worm = this;
    if (!worm.game.server) {
      if (state) new DrillFX(worm);
    } else {
      worm.drill = state;
      worm.updated = worm.drillUpdated = true;
    }
  }

  setInvisible ( state ) {
    const worm = this;
    if (!worm.game.server) {
      if (state) new InvisibleFX(worm);
    } else {
      worm.invisible = state;
      worm.updated = worm.invisibleUpdated = true;
    }
  }

  setMessage ( msg ) {
    const worm = this;
    worm.message = msg || '';
    worm.updated = worm.messageUpdated = true;
  }

  setAbility ( ability ) {
    const worm = this;
    worm.ability = ability || null;
    worm.updated = worm.abilityUpdated = true;
  }

  setGhost ( to ) {
    const worm = this;
    worm.ghost = to ? true : false;
    worm.updated = worm.ghostUpdated = true;
  }

  addScore ( score ) {
    const worm = this;
    const game = worm.game;
    worm.player.score += score || 0;
  }

  drop ( number, index, body ) {
    const worm = this;
    const game = worm.game;
    if (!game.server || !worm.alive) return;

    console.log(`${worm.constructor.name} ${worm.id} is dropping:`)
    for (let i = index; i < number; i++) {
      if (!Math.round(Math.random() * 2)) {
        const partCoord = body[i];
        let point = game.addPoint();
        point.setCoords(worm.displace(partCoord, 5));
        point.setCreator(worm.id);
      }
    }
  }

  die () {
    const worm = this;
    const body = worm.body;

    if (!worm.alive) return;

    worm.drop(body.length, 0, body);
    worm.setMessage('Bad luck... Press [SPACE] to respawn!');
    worm.alive = false;
    worm.updated = true;
  }

  spawn () {

    const worm = this;
    const game = worm.game;
    let dirX = Math.round(Math.random() * 2) - 1;
    let dirY = (dirX) ? 0 : (Math.round(Math.random())) ? -1 : 1;

    if (game.server) {
      worm.setGhost(true);
    }

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

        worm.alive = true;
        worm.updated = true;

        if (!game.server) {
          Globals.renderCallbacks.push(worm.render());
        } else {

          game.tick.beforeCallbacks.push(worm.move());
          game.tick.onCallbacks.push(worm.isColliding());
        }

        if (game.server) {
          setTimeout(function () {
            worm.setGhost(false);
          }, 5000);
        }
      }
    })(game.players);
  }

  isColliding ( callback ) {
    const worm = this;
    const game = worm.game;

    return function ( players ) {
      let collision = false;

      players.forEach(function ( player, index ) {

        player.body.forEach(function ( part, index ) {
          if (worm.isImmune() || player.ghost) return;
          if (player === worm && !index) return;

          if (game.areColliding(worm.coords, part)) {
            console.log(`${worm.constructor.name} ${worm.id} is colliding with ${worm.constructor.name} ${player.id}`);
            worm.die();
            if (player.id !== worm.id) player.addScore(worm.body.length * 10);
            collision = true;
          }
        });
      });

      if (callback) {
        callback(collision);
      }
      worm.updated = true;
      return worm.alive;
    }
  }

  setDirection ( direction ) {
    const worm = this;
    const game = worm.game;
    if (direction[0] === worm.direction [0] * -1
      && direction[1] === worm.direction [1] * -1) {
      return;
    }

    worm.nextDirection = direction;
  }

  grow ( by ) {
    const worm = this;

    let tail = worm.body[worm.body.length - 1];
    for (by; by > 0; by--) {
      worm.size++;
      worm.body.push([tail[0], tail[1]]);
      worm.updated = worm.bodyUpdated = true;
    }
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

      if (tail[0] >= Globals.resolution[0]) {
        tail[0] -= Globals.resolution[0];
      } else if (tail[0] < 0) {
        tail[0] = Globals.resolution[0];
      }

      if (tail[1] >= Globals.resolution[1]) {
        tail[1] -= Globals.resolution[1];
      } else if (tail[1] < 0) {
        tail[1] = Globals.resolution[1];
      }

      body.unshift(body.pop());
      worm.updated = worm.bodyUpdated = true;
      return worm.alive;
    };
  }

  render () {
    let worm = this;
    return function () {
      let pixels = [];

      if (!worm || !worm.alive) {
        pixels.die = true;
        return pixels;
      }

      worm.body.forEach(function ( part ) {

        let r = worm.color[0];
        let g = worm.color[1];
        let b = worm.color[2];
        let pixel;

        if (worm.ghost) {
          const factor = Math.sin(parseFloat('0.'+ (new Date().getTime() / 1000).toString().split('.')[1]) * Math.PI);
          r *= factor;
          g *= factor;
          b *= factor;
        }

        pixels.push(new Pixel(1, r, g, b, part));
      });

      return pixels;
    };
  }
};
