"use strict";



const Globals = require('./globals.js');
const Pixel = require('./pixel.js');
const Connection = require('./connection.js');
const Renderer = require('./renderer.js');
const Mobile = require('./mobile.js');
const Setup = require('./setup.js');
const Scores = require('./scores.js');
const AllTime = require('./all-time-high.js');
const Sounds = require('./sounds.js');
const EventEmitter = require('events');

class Client extends EventEmitter {
  constructor () {
    super();
    const client = this;

    client.mainView = document.getElementById('main');
    client.scoreBoard =  document.getElementById('scores');
    client.scoreHUD =  document.querySelector('.status > .score');
    client.messageHUD = document.querySelector('.status > .message');
    client.abilitiesHUD = document.querySelector('.status > .abilities');
    client.dpad = document.querySelector('#dpad');

    client.globals = Globals;
//    client.globals.screen = document.body.screen;
    client.connection = new Connection(client);
    client.setup = new Setup(client);
    client.renderer = new Renderer(client);
    client.mobile = new Mobile(client);
    client.scores = new Scores(client);
    client.allTime = new AllTime(client);
    client.sounds = new Sounds(client);
    client._state = 'setup';
    client._showScores = false;
    client._message = '';
    client._abilitiesMessage = '';
    client._score = 0;

    console.log(client)
  }

  get showScores () {
    return this._showScores;
  }

  set showScores ( state ) {
    this._showScores = !!state;

    if (!state) {
      this.scoreBoard.style.display = 'none';
      if (this.mobile.isMobile && this.state === 'screen') this.dpad.style.display = 'block'
    } else {
      this.dpad.style.display = 'none'
      this.scoreBoard.style.display = 'block';
    }
  }

  get state () {
    return this._state;
  }

  set state ( state ) {
    this._state = this.mainView.className = state;
  }

  get abilitiesMessage () {
    return this._abilitiesMessage;
  }

  set abilitiesMessage ( message ) {
    console.log(message)
    this._abilitiesMessage = this.abilitiesHUD.innerText = message;
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
