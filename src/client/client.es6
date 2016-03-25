"use strict";

//initMatrix();

const _game = new Game();
_game.init();

let _self;
let _selfID;

WebSocket = WebSocket || MozWebSocket;
let connection = new WebSocket('ws://'+ location.hostname +':{{socket}}');

connection.onopen = function () {

  addEventListener('keydown', function ( ev ) {
    ev.preventDefault();
    let code = ev.keyCode;
    let direction;
    let respawn = 0;

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
        respawn = 1;
      break;
    }

    let message = {};
    if (direction)  message.d = direction;
    else if (!_self.alive) message.r = respawn;

    if (direction || respawn) connection.send(JSON.stringify(message));
  });
};

connection.onerror = function (error) {
  connection.close();
};

connection.onmessage = handleIdentityUpdate;

function handleIdentityUpdate ( message ) {
  let update = JSON.parse(message.data);
  _selfID = update.id;
  connection.onmessage = handleStateUpdate;
}

function handleStateUpdate (message) {
  let update = JSON.parse(message.data);

  for (let pointID in update.po) {
    let pointUpdate = update.po[pointID];
    let foundPoint = _game.getPointById(pointID, Point);
    let type = 'p';

    if (!foundPoint) {

      switch (pointUpdate.t) {
        case 'p':
          type = Point;
        break;
        case 'gp':
          type = GoldenPoint;
        break;
      }

      foundPoint = _game.addPoint(pointID, type);
    }
    if (pointUpdate.d) {
      foundPoint.die();
    } else {
      foundPoint.coords = pointUpdate.c;
    }
  }

  for (let playerID in update.pl) {
    let playerUpdate = update.pl[playerID];
    let foundPlayer = _game.getPlayerById(playerID);

    if (!foundPlayer) {
      foundPlayer = _game.addPlayer(playerID);
      if (foundPlayer.id === _selfID) {
        _self = foundPlayer;
        foundPlayer.client = true;
      }
    }

    if (playerUpdate.d) {
      foundPlayer.die();
    } else {
      foundPlayer.ghost = playerUpdate.g;
      foundPlayer.body = playerUpdate.b;
      foundPlayer.coords = foundPlayer.body[0];
    }
  }

  _game.ditchTheDead()
}
