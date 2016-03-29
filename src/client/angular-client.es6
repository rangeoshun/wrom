"use strict";

const Game = require('./game.js');
const connect = require('./angular-connect.js');
const render = require('./angular-render.js');

const game = new Game();
module.exports = game;
game.init();

let checkIfLoaded = setInterval(function () {
  if (typeof connect === 'function' && typeof render === 'function') {

    clearTimeout(checkIfLoaded);

    if (!window.clientInit) {
      window.clientInit = true;

      const client = angular.module('client', []);
      client.controller('connect', ['$scope', connect]);
      client.controller('screen', ['$scope', render]);

      angular.bootstrap(document.body, ['client']);
    }
  }
}, 100);
