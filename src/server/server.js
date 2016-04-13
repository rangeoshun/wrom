"use strict";
const url = require("url");
const path = require("path");
const fs = require("fs");

const Globals = require('./globals.js');
const MimeTypes = require('./mime-types.js');
const Player = require('./player.js');
const Game = require('./game.js');
const game = new Game(true, Globals);
game.allTimeHigh = JSON.parse(fs.readFileSync('./db/high-scores.json'));
game.allTimeHigh.updated = true;

const httpPort = process.env.PORT || process.argv[2] || 80;
const WebSocketServer = require('websocket').server;
const http = require('http');

let socketServer = http.createServer(function () {})

const httpServer = http.createServer(function ( request, response ) {

  let uri = '{{www}}' + url.parse(request.url).pathname;
  let filename = path.join(process.cwd(), uri);

  try {

    if (uri.indexOf('highscores') > -1) {
      fs.readFile('./db/high-scores.json', "utf8", function( err, file ) {
        if (err) {

          response.writeHead(500, {"Content-Type": "text/plain"});
          response.write(err + "\n");
          response.end();
          return;
        }

        response.writeHead(200, {"Content-Type": "text/json"});
        response.write(file, "utf8");
        response.end();
      });

      return;
    }

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
      const mimeType = MimeTypes['.'+ filename.split('.')[1]] || 'text/plain';
      response.writeHead(200, {"Content-Type": mimeType});
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
let wss = new WebSocketServer({httpServer: httpServer});

wss.on('request', function ( request ) {
  let connection = request.accept(null, request.origin);

  console.log(`Connection from ${request.remoteAddress}`);
  let player = new Player();
  Globals.players.push(player);
  player.manifest(game.addPlayer());
  player.setConnection(connection);

  console.log(`PlayerID: ${player.id} by name ${player.name}`);

  connection.send(JSON.stringify({id: player.id}));
  const startState = JSON.stringify(game.getState(true));
  connection.send(startState);

  function syncPlayer ( state ) {
    connection.send(JSON.stringify(state));
    return !!player;
  }

  game.syncCallbacks.push(syncPlayer);
  console.log('Remaining players: ',game.players.length);

  connection.on('message', function ( message ) {

    const update = JSON.parse(message.utf8Data);
    let direction = update.dr;
    const respawn = update.rs;
    const spawn = update.sa;
    const color = update.cl;
    const name = update.nm;
    const ability = update.ai;
    const die = update.de;

    if (color) {
      player.setColor(color);
    }

    if (name) {
      player.setName(name);
    }

    if (player.entity.alive) {

      if (ability && player.entity.ability) {
        player.entity.ability();
      }

      if (die) {
        player.entity.die();
      }

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

        player.entity.setDirection(direction);
      }
    } else if (respawn) {

      player.score = 0;
      delete player.entity;

      player.manifest(game.addPlayer());
      player.entity.color = player.color;
      player.entity.name = player.name;

    }
  });

  connection.on('close', function () {
    console.log('Connection closed from '+ request.origin);
    console.log('Remaining players: ', game.players.length);
    player.entity.die();
    Globals.players.splice(Globals.players.indexOf(player), 1);
  });

  function sortScores ( scores ) {
    if (!scores) return [];
    return scores.sort(function ( s0, s1 ) {
      return s0.so > s1.so ? -1 : s0.so == s1.so ? 0 : 1;
    }).map(function ( score, index ) {
      return {
        pa: index + 1,
        so: score.so,
        nm: score.nm,
      };
    });
  };

  game.onDieCallback = function ( worm ) {
    let currentScore = {
      nm: worm.player.name,
      so: worm.player.score
    };

    if (!currentScore.so) return;

    let added = false;

    game.allTimeHigh.forEach(function ( highScore ) {
      if (highScore.nm === currentScore.nm) {
        added = true;
        if (highScore.so < currentScore.so) highScore.so = currentScore.so;
      }
    });

    if (!added) game.allTimeHigh.push(currentScore);

    game.allTimeHigh = sortScores(game.allTimeHigh);
    fs.writeFile('./db/high-scores.json', JSON.stringify(game.allTimeHigh), function () {
      game.allTimeHigh.updated = true;
    });
  };
});
