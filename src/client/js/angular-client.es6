"use strict";

const connect = require('./angular-connect.js');
const render = require('./angular-render.js');
const setup = require('./angular-setup.js');
const scores = require('./angular-scores.js');
const colors = require('./angular-colorpicker.js');

if (!window.clientInit) {
  window.clientInit = true;

  const client = angular.module('client', [])
    .filter('checklength', function () {
      var prevInput;
      var defInput = 'UNNAMED';
      return function ( input ) {
        if (!input) return prevInput || defInput;
        return prevInput = (input.length > 16 ? input.substr(0, 16) : input).toUpperCase();
      };
    })
    .filter('orderScores', function () {
      return function ( scores ) {
        if (!scores) return [];
        return scores.sort(function ( s0, s1 ) {
          return s0.score > s1.score ? 1 : s0.score == s1.score ? 0 : -1;
        }).map(function ( score, index ) {
          score.place = index + 1;
          return score;
        });
      };
    });

  client.controller('connect', ['$scope', connect]);
  client.controller('setup', ['$scope', '$filter', setup]);
  client.controller('colors', ['$scope', colors]);
  client.controller('screen', ['$scope', render]);
  client.controller('scores', ['$scope', '$filter', scores]);
  angular.bootstrap(document.body, ['client']);
}
