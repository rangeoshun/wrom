"use strict";

initMatrix();

const _game = new Game();
_game.init();

let _self;
let _selfID;

window.WebSocket = window.WebSocket || window.MozWebSocket;
let connection = new WebSocket('ws://'+ location.hostname +':666');

connection.onopen = function () {

  window.addEventListener('keydown', function ( ev ) {
    ev.preventDefault();
    let code = ev.keyCode;
    let direction;
    switch (code) {
      case 38:
        direction = [0, -1];
      break;
      case 39:
        direction = [1, 0];
      break;
      case 40:
        direction = [0, 1];
      break;
      case 37:
        direction = [-1, 0];
      break;
    }

    if (direction) connection.send(JSON.stringify({direction: direction}));
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
    let foundPoint = _game.getPointById(pointID);

    if (!foundPoint) {
      foundPoint = _game.addPoint(pointID);
    }

    foundPoint.coords = pointUpdate.c;
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
      foundPlayer.body = playerUpdate.b;
      foundPlayer.coords = foundPlayer.body[0];
    }
  }

  _game.ditchTheDead()
}
