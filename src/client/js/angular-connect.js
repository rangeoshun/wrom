"use strict"

const Globals = require('./globals.js');
const Point = require('./point.js');
const GoldenPoint = require('./golden-point.js');
const MinePoint = require('./mine-point.js');
const PickupMinePoint = require('./pickup-mine-point.js');
const GhostPoint = require('./ghost-point.js');
const PortalPoint = require('./portal-point.js');
const PortalIOPoint = require('./portal-io-point.js');

const Worm = require('./worm.js');
const Game = require('./game.js');
const game = new Game(false, Globals);

module.exports = function ( $scope ) {
  let connection;

  game.globals = Globals;
  Globals.user = JSON.parse(atob(localStorage.wormer || 'e30='));
  $scope.globals = Globals;

  $scope.status = {
    message: '',
    score: 0
  };

  $scope.game = game;
  $scope.state = 'setup';

  $scope.getState = function () {
    return $scope.state;
  };

  $scope.$on('changeName', function ( ev, name ) {
    Globals.user.name = name;
    localStorage.wormer = btoa(JSON.stringify(Globals.user));
    if (connection) connection.send(JSON.stringify({nm: name}));
    else $scope.name = name;
  });

  $scope.$on('changeColor', function ( ev, color ) {
    Globals.user.color = color;
    localStorage.wormer = btoa(JSON.stringify(Globals.user));
    if (connection) connection.send(JSON.stringify({cl: color}));
    else $scope.color = color;
  });

  $scope.toggleState = function () {
    $scope.state === 'screen' ? 'setup' : 'screen';
    return $scope.state;
  };

  $scope.$on('update', function ( ev, scores ) {
    scores.forEach(function ( score ) {
      if (score.id === Globals.selfID) $scope.status.score = score.so;
    });
  });

  $scope.$on('goPlay', function () {
    $scope.state = 'screen';
    if (connection) return;

    addEventListener('keydown', function showScores ( ev ) {
      if (ev.keyCode === 9 && !$scope.showScores) {

        $scope.$apply(function () {
          $scope.showScores = true;
        });

        addEventListener('keyup', function hideScores ( ev ) {
          if (ev.keyCode === 9) {
            $scope.$apply(function () {
              $scope.showScores = false;
            });
            removeEventListener('keyup', hideScores);
          }
        });

      } else if (ev.keyCode === 27) {

        $scope.$apply(function () {
          $scope.state = $scope.state === 'screen' ? 'setup' : 'screen';
        });

        if ($scope.state === 'setup') {
          connection.send(JSON.stringify({de: 1}));
        } else {
          ev.preventDefault();
        }
      }
    }, true);

    WebSocket = WebSocket || MozWebSocket;
    connection = new WebSocket(`ws://${location.hostname}:{{socket}}`);
    connection.onopen = function () {

      connection.send(JSON.stringify({
        nm: $scope.name,
        cl: $scope.color
      }));

      addEventListener('keydown', function ( ev ) {
        if ($scope.state === 'screen') ev.preventDefault();
        let code = ev.keyCode;
        let direction;
        let respawn = 0;
        let ability = 0;

        switch (code) {
          case 38:
            direction = 1;
          break;
          case 39:
            direction = 2;
          break;
          case 40:
            direction = 3;
          break;
          case 37:
            direction = 4;
          break;
          case 32:
            respawn = !Globals.self.alive ? 1 : 0;
            ability = !respawn ? 1 : 0;
          break;
        }

        let message = {};
        if (direction) {
          message.dr = direction;
        } else if (respawn) {
          message.rs = respawn;
        } else if (ability) {
          message.ai = ability;
        }

        if (direction || respawn || ability) connection.send(JSON.stringify(message));
      });
    };

    connection.onerror = function (error) {
      connection.close();
    };

    connection.onmessage = handleIdentityupdate;

    function handleIdentityupdate ( message ) {
//      game.tick.step();
      let update = JSON.parse(message.data);
      Globals.selfID = update.id;
      connection.onmessage = handleStateupdate;
      game.tick.step();
    }

    function handleStateupdate (message) {
//      game.tick.step();
      let update = JSON.parse(message.data);

      $scope.$apply(function () {
        $scope.$broadcast('update', update.sc);
      });

      for (let pointID in update.pi) {
        let pointUpdate = update.pi[pointID];
        let foundPoint = game.getPointById(pointID, Point);
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
          }

          foundPoint = game.addPoint(type);
          foundPoint.id = pointID;
        }

        if (pointUpdate.de) {
          foundPoint.die(pointUpdate.de);
        } else {

          if (pointUpdate.ce) {
            foundPoint.setCreator(pointUpdate.ce);
          }

          if (pointUpdate.co) {
            foundPoint.setCoords(pointUpdate.co);
          }

          if (pointUpdate.cl) {
            foundPoint.setColor(pointUpdate.cl);
          }

          if (pointUpdate.am) {
            foundPoint.arm();
          }
        }
      }

      for (let playerID in update.pa) {
        let playerUpdate = update.pa[playerID];
        let foundPlayer = game.getPlayerById(playerID);

        if (!foundPlayer) {

          foundPlayer = game.addPlayer();
          foundPlayer.id = playerID;

          if (foundPlayer.id === Globals.selfID) {

            $scope.$apply(function () {
              $scope.showScores = false;
            });

            Globals.self = foundPlayer;
            $scope.showScores = false;
            foundPlayer.client = true;
          }
        }

        if (foundPlayer.id === Globals.selfID) {
          if (typeof playerUpdate.ms === 'string') $scope.status.message = playerUpdate.ms;
        }

        if (playerUpdate.nm) foundPlayer.setName(playerUpdate.nm);
        if (playerUpdate.cl) foundPlayer.setColor(playerUpdate.cl);
        if (playerUpdate.go !== undefined) foundPlayer.setGhost(!!playerUpdate.go);
        if (playerUpdate.bd) foundPlayer.body = playerUpdate.bd;
        if (playerUpdate.co) foundPlayer.coords = foundPlayer.body[0];

        if (playerUpdate.de) {
          if (foundPlayer.id === Globals.selfID) {
            $scope.$apply(function () {
              $scope.showScores = true;
            });
          }

          foundPlayer.die();
        }
      }

      game.ditchTheDead();
      game.tick.step();
    }
  });
}
