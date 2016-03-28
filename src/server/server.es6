"use strict";

const Game = require('./game.js');
const game = new Game();
game.init(true);

let url = require("url");
let path = require("path");
let fs = require("fs");

const httpPort = process.argv[2] || 8888;
const socketPort = process.argv[3] || 666;
const WebSocketServer = require('websocket').server;
const http = require('http');

let socketServer = http.createServer(function () {})
let wss = new WebSocketServer({httpServer: socketServer});

http.createServer(function ( request, response ) {

  let uri = '{{www}}' + url.parse(request.url).pathname;
  let filename = path.join(process.cwd(), uri);

  try {
    if (fs.statSync(filename).isDirectory()) {
      filename += 'index.html';
    }

    fs.readFile(filename, "binary", function( err, file ) {
      if (err) {

        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  } catch (e) {

    response.writeHead(404);
    response.write('404');
    response.end();
  }
}).listen(parseInt(httpPort, 10));
console.log(`HTTP server listening on port: ${httpPort}`);
// Websocket server
socketServer.listen(socketPort, function () {});
console.log(`Socket server listening on port: ${socketPort}`);

wss.on('request', function ( request ) {
  let connection = request.accept(null, request.origin);

  console.log(`Connection from ${request.remoteAddress}`);
  connection.player = game.addPlayer();
  connection.player.connection = connection;
  connection.score = 0;
  let playerID = connection.player.id;
  console.log(`PlayerID: ${playerID}`);
  connection.send(JSON.stringify(`{id: ${playerID}}`));
  const startState = JSON.stringify(game.getState(true));
  connection.send(startState);

  function syncPlayer ( state ) {
    connection.send(JSON.stringify(state));
    return !!connection.player;
  }

  game.syncCallbacks.push(syncPlayer);
  console.log('Remaining players: ',game.players.length);

  connection.on('message', function ( message ) {
    let player = connection.player;
    const update = JSON.parse(message.utf8Data);
    let direction = update.d;
    const respawn = update.r;

    if (direction) {

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

      player.setDirection(direction);
    } else if (respawn && !player.alive) {
      console.log();
      connection.player = game.addPlayer();
      connection.player.connection = connection;
      connection.player.id = playerID;
    }
  });

  connection.on('close', function () {
    console.log('Connection closed from '+ request.origin);
    console.log('Remaining players: ', game.players.length);
    connection.player.die();
    delete connection.player;
  });
});
