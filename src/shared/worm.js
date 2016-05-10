"use strict";
const globals = require('./globals.js');
const Entity = require('./entity.js');
const Pixel = require('./pixel.js');
const InvisibleFX = require('./invisible-fx.js');
const DrillFX = require('./drill-fx.js');
const GhostAbility = require('./ghost-ability.js');
const DrillAbility = require('./drill-ability.js');
const InvisibleAbility = require('./invisible-ability.js');
const PortalAbility = require('./portal-ability.js');
const PickupMineAbility = require('./pickup-mine-ability.js');

module.exports = class Worm extends Entity {
  constructor ( game ) {
    super(game);
    const worm = this;
    worm.color = worm.client ? [0.5,0.5,1] : [1,0.5,0.5];
    worm.direction = [];
    worm.directionCue = [];

    worm.abilities = [false,false,false,false,false];
    worm.abilitiesMessage;
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
    return !worm.alive || worm.ghost || worm.drill || false;
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

  setAbility ( AbilityType, add ) {
    const worm = this;
    let ability;
    let index;

    if (AbilityType === GhostAbility) {
      index = 0;
    } else if (AbilityType === DrillAbility) {
      index = 1;
    } else if (AbilityType === InvisibleAbility) {
      index = 2;
    } else if (AbilityType === PortalAbility) {
      index = 3;
    } else if (AbilityType === PickupMineAbility) {
      index = 4;
    }

    worm.abilities[index] = add ? new AbilityType(worm) : false;
    worm.abilitiesMessage[index] = `[${add ? index + 1 : ' '}]`;
    worm.updated = worm.abilitiesUpdated = true;
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

    console.log(`${worm.constructor.name} ${worm.player ? worm.player.name : worm.id} is dropping:`)
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
    const game = worm.game;
    const players = game.players;

    game.tick.afterCallbacks.push(() => {
      if (!worm.alive) return;
      worm.drop(body.length, 0, body);
      worm.alive = false;
      worm.body.splice(0);
      worm.bodyUpdated = true;
      worm.updated = true;

      if (!game.server
        && (!globals.spectatee
          || globals.spectatee.id == worm.id)) {

          const randomPlayerIndex = Math.floor(Math.random()*players.length);
          globals.spectatee = players[randomPlayerIndex];

        } else if (game.onDieCallback) {
          game.onDieCallback(worm);
        }
    });

    worm.setMessage('Bad luck... Press [SPACE] to respawn!');


  }
  spawn () {
    const worm = this;
    const game = worm.game || {};
    const globals = game.globals || {};

    let dirX = Math.round(Math.random() * 2) - 1;
    let dirY = (dirX) ? 0 : (Math.round(Math.random())) ? -1 : 1;

    if (game.server) {
      worm.setGhost(true);
    }
    worm.direction[0] = dirX;
    worm.direction[1] = dirY;
    worm.body = [];
    worm.relocate();

    for (let i = 0; i < worm.size; i++) {
      worm.body.push([worm.coords[0] - i * worm.direction[0], worm.coords[1] - i * worm.direction[1]]);
    }

    worm.isColliding(function ( collision ) {
      if (collision || !worm.game) {

        console.log(`${worm.constructor.name} ${worm.player ? worm.player.name : worm.id} is dying to respawn`);
        worm.spawn();

      } else {

        console.log(`${worm.constructor.name} ${worm.player ? worm.player.name : worm.id} is spawning`);
        worm.alive = true;
        worm.bodyUpdated = true;
        worm.abilitiesMessage = ['[ ]','[ ]','[ ]','[ ]','[ ]'];
        worm.abilitiesUpdated = true;
        worm.updated = true;

        if (!game.server) {

          globals.renderCallbacks.push(worm.render());

        } else {

          game.tick.beforeCallbacks.push(worm.move());
          game.tick.onCallbacks.push(worm.isColliding());

          setTimeout(function () {
            worm.setGhost(false);
          }, 5000);
        }
      }
    })(game.players);
  }

  isColliding ( callback ) {
    const worm = this;

    return function ( players ) {
      let collision = false;
      const game = worm.game;
      const playersLength = players.length;

      for (var i = 0; i < playersLength; i++) {
        const player = players[i];
        const body = player.body;
        const bodyLength = body.length;

        if (!worm.isImmune()) {

          for (var j = 0; j < bodyLength; j++) {

            if (player.id !== worm.id || j) {
              const part = body[j];

              if (part && game.areColliding(worm.body[0], part, true)) {
                console.log(`${worm.player.name || worm.id} is colliding with ${worm.constructor.name} ${player.id}`);

                worm.die();

                if (player.id !== worm.id) player.addScore(worm.body.length * 10);
                collision = true;
              }
            }
          }
        }
      }

      if (callback) {
        callback(collision);
      }
      worm.updated = true;
      return (game) ? game.server : worm.alive;
    }
  }

  setDirection ( direction ) {
    const worm = this;
    const game = worm.game;
    if (worm.directionCue[worm.directionCue.length] &&
      (direction[0] === worm.directionCue[worm.directionCue.length][0] * -1
      && direction[1] === worm.directionCue[worm.directionCue.length] * -1
      || (direction[0] === worm.directionCue[worm.directionCue.length][0]
      && direction[1] !== worm.directionCue[worm.directionCue.length]))) {

      return;
    }
    worm.directionCue.push(direction);
  }

  getPickDistance () {
    const player = this;
    return Math.max((player && player.body.length) ? Math.sqrt(player.body.length / 4) + 1 : 4, 4);
  }

  grow ( by ) {
    const worm = this;
    let body = worm.body;

    if (!worm.alive) return;

    let tail = body[body.length - 1];

    if (by < 0) {

      body.splice(body.length + by);

    } else {

      for (by; by > 0; by--) {
        worm.size++;
        body.push([tail[0], tail[1]]);
        worm.updated = worm.bodyUpdated = true;
      }
    }
  }

  move () {
    const worm = this;
    let doubleTick = 1;
    return function () {

      if (!worm.alive) return false;
      if (!doubleTick) {
        doubleTick++;
        return;
      }
      doubleTick--;

      const coords = worm.coords;
      let body = worm.body;
      const head = worm.body[0];
      let tail = worm.body[worm.body.length - 1];
      let direction = worm.direction;
      const nextDirection = worm.directionCue.shift();

      if (nextDirection && nextDirection[0] !== direction[0] * -1
        && nextDirection[1] !== direction[1] * -1) {
        worm.direction[0] = nextDirection[0];
        worm.direction[1] = nextDirection[1];
      }

      tail[0] = coords[0] = head[0] + direction[0];
      tail[1] = coords[1] = head[1] + direction[1];

      if (tail[0] >= globals.resolution[0]) {
        tail[0] -= globals.resolution[0];
      } else if (tail[0] < 0) {
        tail[0] = globals.resolution[0];
      }

      if (tail[1] >= globals.resolution[1]) {
        tail[1] -= globals.resolution[1];
      } else if (tail[1] < 0) {
        tail[1] = globals.resolution[1];
      }

      body.unshift(body.pop());

      worm.updated = worm.bodyUpdated = true;
      return worm.alive;
    };
  }

  render () {
    const worm = this;
    function renderWorm ( world, renderer ) {
      let pixels = [];
      if (!worm.alive) {
        pixels.die = true;
      }

      const body = worm.body;
      const bodyLength = body.length;
      const color = worm.color;
      console.log(bodyLength)
      for (var i = 0; i < bodyLength; i++) {

        if (!pixels[i]) {
          pixels[i] = new Pixel();
        }

        let r = worm.color[0];
        let g = worm.color[1];
        let b = worm.color[2];
        let pixel = pixels[i];

        if (worm.ghost) {
          const factor = Math.sin(parseFloat('0.'+ (new Date().getTime() / 1000).toString().split('.')[1]) * Math.PI);
          r *= factor;
          g *= factor;
          b *= factor;
        }

        pixel[1] = r;
        pixel[2] = g;
        pixel[3] = b;
        pixel[4] = body[i];
      }

      if (pixels.length > bodyLength) {
        pixels.splice(bodyLength - 1);
      }

      return pixels;
    }

    renderWorm.parent = worm;
    renderWorm.born = new Date().getTime();
    return renderWorm;
  }
};
