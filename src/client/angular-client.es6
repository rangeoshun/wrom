"use strict";

const connect = require('./angular-connect.js');
const render = require('./angular-render.js');
const colors = require('./angular-colorpicker.js');

let checkIfLoaded = setInterval(function () {
  if (typeof connect === 'function' && typeof render === 'function') {

    clearTimeout(checkIfLoaded);

    if (!window.clientInit) {
      window.clientInit = true;

      const client = angular.module('client', []);
      client.controller('connect', ['$scope', connect]);
      client.controller('screen', ['$scope', render]);
      client.controller('colors', ['$scope', colors]);
      angular.bootstrap(document.body, ['client']);
    }
  }
}, 100);
