"use strict";
const Globals = require('./globals.js');
const Pixel = require('./pixel.js');
const Connection = require('./connection.js');
const Renderer = require('./renderer.js');
const Setup = require('./setup.js');
const Scores = require('./scores.js');
const AllTime = require('./all-time-high.js');
const EventEmitter = require('events');


class Client extends EventEmitter {
  constructor () {
    super();
    const client = this;

    client.globals = Globals;
    client.connection = new Connection(client);
    client.setup = new Setup(client);
    client.renderer = new Renderer(client);
    client.scores = new Scores(client);
    client.allTime = new AllTime(client);
  }
}

new Client();
