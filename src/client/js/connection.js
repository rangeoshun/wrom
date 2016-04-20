"use strict";

const Globals = require('./globals.js');
const Point = require('./point.js');
const GoldenPoint = require('./golden-point.js');
const MinePoint = require('./mine-point.js');
const PickupMinePoint = require('./pickup-mine-point.js');
const GhostPoint = require('./ghost-point.js');
const PortalPoint = require('./portal-point.js');
const PortalIOPoint = require('./portal-io-point.js');
const InvisiblePoint = require('./invisible-point.js');
const DrillPoint = require('./drill-point.js');

const Worm = require('./worm.js');
const Game = require('./game.js');
const game = new Game(false, Globals);

module.exports = class Connection {
  constructor ( client ) {
    let connection;
    const globals = client.globals;
    game.globals = globals;
    globals.user = JSON.parse(atob(localStorage.wormer || 'e30='));

    client.message = '';
    client.score = 0;

    client.game = game;
    client.state = 'setup';

    client.getState = function () {
      return client.state;
    };

    client.on('changeName', function ( name ) {
      globals.user.name = name;
      localStorage.wormer = btoa(JSON.stringify(globals.user));
      if (connection && connection.readyState === 1) connection.send(JSON.stringify({nm: name}));
      else client.name = name;
    });

    client.on('changeColor', function ( color, colorName ) {
      globals.user.color = color;
      color[4] = colorName;
      localStorage.wormer = btoa(JSON.stringify(globals.user));
      if (connection && connection.readyState === 1) connection.send(JSON.stringify({cl: color}));
      else client.color = color;
    });

    client.toggleState = function () {
      client.state === 'screen' ? 'setup' : 'screen';
      return client.state;
    };

    client.on('update', function ( scores ) {
      scores.forEach(function ( score ) {
        if (score.id === globals.selfID) client.score = score.so;
      });
    });

    WebSocket = WebSocket || MozWebSocket;
    connection = new WebSocket(`ws://${location.hostname}:${location.port}`);
    connection.onopen = function () {

      client.on('goPlay', function () {
        client.state = 'screen';
        if (connection) return;

        addEventListener('keydown', function showScores ( ev ) {
          if (ev.keyCode === 9 && !client.showScores) {

            client.showScores = true;

            addEventListener('keyup', function hideScores ( ev ) {
              if (ev.keyCode === 9) {
                client.showScores = false;
                removeEventListener('keyup', hideScores);
              }
            });

          } else if (ev.keyCode === 27) {

            client.state = client.state === 'screen' ? 'setup' : 'screen';

            if (client.state === 'setup') {
              connection.send(JSON.stringify({de: 1}));
            } else {
              ev.preventDefault();
            }
          }
        }, true);
      });

      addEventListener('keydown', function ( ev ) {
        let code = ev.keyCode;
        let direction;
        let respawn = 0;
        let ability = 0;

        switch (code) {
          case 38:
            ev.preventDefault();
            direction = 1;
          break;
          case 39:
            ev.preventDefault();
            direction = 2;
          break;
          case 40:
            ev.preventDefault();
            direction = 3;
          break;
          case 37:
          ev.preventDefault();
            direction = 4;
          break;
          case 32:
            ev.preventDefault();
            respawn = !globals.self.alive ? 1 : 0;
            ability = !respawn ? 1 : 0;
          break;
          case 9:
            ev.preventDefault();
            if (!client.showScores) {

              client.showScores = true;

              addEventListener('keyup', function hideScores ( ev ) {
                if (ev.keyCode === 9) {
                  client.showScores = false;
                  removeEventListener('keyup', hideScores);
                }
              });
            }
          break;
          case 27:
          ev.preventDefault();

            client.state = client.state === 'screen' ? 'setup' : 'screen';

            if (client.state === 'setup') {
              connection.send(JSON.stringify({de: 1}));
            } else {
              ev.preventDefault();
            }
          break;
        }

        let message = {};
        if (direction) {
          message.dr = direction;

          switch (direction) {
            case 1:
              direction = [0, -1];
            break;
            case 2:
              direction = [1, 0];
            break;
            case 3:
              direction = [0, 1];
            break;
            case 4:
              direction = [-1, 0];
            break;
          }

          globals.self.setDirection(direction);
        } else if (respawn) {
          message.rs = respawn;
        } else if (ability) {
          message.ai = ability;
        }

        if (direction || respawn || ability) connection.send(JSON.stringify(message));
      });

      connection.send(JSON.stringify({
        nm: client.name,
        cl: client.color
      }));
    };

    connection.onerror = function (error) {
      connection.close();
    };

    connection.onmessage = handleIdentityupdate;

    function handleIdentityupdate ( message ) {
//      game.tick.step();
      let update = JSON.parse(message.data);
      globals.selfID = update.id;
      connection.onmessage = handleStateupdate;
//      game.tick.step();
    }

    let update;
    let foundPoint;
    let pointUpdate;
    let playerUpdate;
    let foundPlayer;
    function handleStateupdate (message) {

      game.ditchTheDead();

      update = JSON.parse(message.data);

      client.emit('update', update.sc);
      if (update.ath) client.emit('allTimeUpdate', update.ath);

      for (let pointID in update.pi) {
        pointUpdate = update.pi[pointID];
        foundPoint = game.getPointById(pointID, Point);
        let type = '';

        if (!foundPoint) {
          switch (pointUpdate.tp) {
            case 'p':
              type = Point;
            break;
            case 'glp':
              type = GoldenPoint;
            break;
            case 'mnp':
              type = MinePoint;
            break;
            case 'pcp':
              type = PickupMinePoint;
            break;
            case 'gop':
              type = GhostPoint;
            break;
            case 'prp':
              type = PortalPoint;
            break;
            case 'piop':
              type = PortalIOPoint;
            break;
            case 'ivp':
              type = InvisiblePoint;
            break;
            case 'dip':
              type = InvisiblePoint;
            break;
          }

          foundPoint = game.addPoint(type);
          foundPoint.id = pointID;
        }

        if (pointUpdate.de) {
          foundPoint.die(pointUpdate.de);
        } else {

          if (pointUpdate.ce) foundPoint.setCreator(pointUpdate.ce);
          if (pointUpdate.co) foundPoint.setCoords(pointUpdate.co);
          if (pointUpdate.cl) foundPoint.setColor(pointUpdate.cl);
          if (pointUpdate.am) foundPoint.arm();
        }
      }

      for (let playerID in update.pa) {
        playerUpdate = update.pa[playerID];
        foundPlayer = game.getPlayerById(playerID);
        let isSelf = (foundPlayer) ? foundPlayer.id === globals.selfID  : false;

        if (!foundPlayer) {

          foundPlayer = game.addPlayer();
          foundPlayer.id = playerID;

          if (foundPlayer.id === globals.selfID) {
            client.showScores = false;

            globals.self = foundPlayer;
            client.showScores = false;
            foundPlayer.client = true;
            isSelf = true;
          }
        }

        if (isSelf) {
          if (typeof playerUpdate.ms === 'string') client.message = playerUpdate.ms;
        }

        if (playerUpdate.de) {
  //          connection.send('{"rs":1}');

          if (isSelf) {
            client.showScores = true;
          }

          foundPlayer.die();

        } else {

          if (playerUpdate.di) foundPlayer.setDrill(playerUpdate.di);
          if (playerUpdate.iv) foundPlayer.setInvisible(playerUpdate.iv);
          if (playerUpdate.nm) foundPlayer.setName(playerUpdate.nm);
          if (playerUpdate.cl) foundPlayer.setColor(playerUpdate.cl);
          if (playerUpdate.go !== undefined) foundPlayer.setGhost(!!playerUpdate.go);
          if (playerUpdate.di && !isSelf) foundPlayer.setDirection(playerUpdate.di);
          if (playerUpdate.bd) {

            foundPlayer.body.unshift(foundPlayer.body.pop());
            foundPlayer.body[0][0] = playerUpdate.bd[0];
            foundPlayer.body[0][1] = playerUpdate.bd[1];
            foundPlayer.coords = foundPlayer.body[0];

            let diff = playerUpdate.bdln - foundPlayer.body.length;
            if (diff) foundPlayer.grow(diff);

            return false;
          }
        }
      }

//      game.tick.step();
    }
  }
}
