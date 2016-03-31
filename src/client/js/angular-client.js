"use strict";

const Pixel = require('./pixel.js');
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
      return function ( input ) {
        if (!input) return '';
        else if (input.length > 16) return input.substr(0, 16).toUpperCase();
        else return input.toUpperCase();
      };
    })
    .filter('orderScores', function () {
      let colorPicker = new Pixel(0,0,0,0,[0,0]);
      return function ( scores ) {
        if (!scores) return [];
        return scores.sort(function ( s0, s1 ) {
          return s0.so > s1.so ? -1 : s0.so == s1.so ? 0 : 1;
        }).map(function ( score, index ) {
          return {
            place: index + 1,
            score: score.so,
            name: score.nm,
            color: colorPicker.setColor(score.cl).getHex()
          };
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
