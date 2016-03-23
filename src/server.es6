// Game
initMatrix();

const _game = new Game();
_game.init(true);

const WebSocketServer = require('websocket').server;
const http = require('http');
let socketServer = http.createServer(function () {})
let wss = new WebSocketServer({httpServer: socketServer});

let url = require("url");
let path = require("path");
let fs = require("fs");
let port = process.argv[2] || 8888;

http.createServer(function ( request, response ) {

  let uri = '/build/client' + url.parse(request.url).pathname;
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
}).listen(parseInt(port, 10));

// Websocket server
socketServer.listen(666, function () {});
wss.on('request', function ( request ) {
  var connection = request.accept(null, request.origin);

  console.log('Connection from '+ request.remoteAddress);
  connection.player = _game.addPlayer();
  console.log('PlayerID: '+ connection.player.id);

  function syncPlayer ( state ) {
    connection.send(JSON.stringify(state));
    return !!connection.player;
  }

  _tickSyncCallbacks.push(syncPlayer);
  console.log('Remaining players: ',_game.players.length);

  connection.on('message', function ( message ) {
    var direction = JSON.parse(message.utf8Data).direction;
    connection.player.setDirection(direction);
  });

  connection.on('close', function () {
    console.log('Connection closed from '+ request.origin);
    console.log('Remaining players: ', _game.players.length);
    connection.player.die();
    delete connection.player;
  });
});
