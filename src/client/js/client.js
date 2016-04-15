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

    client.mainView = document.getElementById('main');
    client.scoreBoard =  document.getElementById('scores');
    client.scoreHUD =  document.querySelector('.status > .score');
    client.messageHUD = document.querySelector('.status > .message');

    client.globals = Globals;
    client.connection = new Connection(client);
    client.setup = new Setup(client);
    client.renderer = new Renderer(client);
    client.scores = new Scores(client);
    client.allTime = new AllTime(client);
    client._state = 'setup';
    client._showScores = false;
    client._message = '';
    client._score = 0;

    console.log(client)
  }

  get showScores () {
    return this._showScores;
  }

  set showScores ( state ) {
    if (!state) this.scoreBoard.style.display = 'none';
    else this.scoreBoard.style.display = 'block';
    this._showScores = !!state;
  }

  get state () {
    return this._state;
  }

  set state ( state ) {
    this._state = this.mainView.className = state;
  }

  get message () {
    return this._message;
  }

  set message ( message ) {
    this._message = this.messageHUD.innerText = message;
  }

  get score () {
    return this._score;
  }

  set score ( score ) {
    this._score = this.scoreHUD.innerText = score;
  }
}

new Client();
