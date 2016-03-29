'use strict';

const Globals = require('./globals.js');
const Game = require('./game.js');
const game = require('./angular-client.js');

module.exports = function ( $scope ) {

  const _screen_canvas = document.createElement('canvas');
  const _screen = _screen_canvas.getContext("2d");
  const _scores = document.createElement('code');
  const _renderCallbacks = Globals.renderCallbacks;

  _screen_canvas.className = 'screen';
  _screen_canvas.width = Globals.resolution[0] * Globals.scale;
  _screen_canvas.height = Globals.resolution[1] * Globals.scale;
  document.body.appendChild(_screen_canvas);
  document.body.appendChild(_scores);

  function render () {
    _screen.fillStyle = '#000';
    _screen.fillRect(0, 0, Globals.resolution[0], Globals.resolution[1]);

    for (let i = 0; i < _renderCallbacks.length; i++) {

      const pixels = _renderCallbacks[i]();
      if (pixels.die) {
          _renderCallbacks.splice(i, 1);
      }

      for (let k = 0; k < pixels.length; k++) {
        const pixel = pixels[k];
        const x = pixel[4][0];
        const y = pixel[4][1];
        const color = pixel.getHex();

        _screen.fillStyle = color;
        _screen.fillRect(x * Globals.scale, y * Globals.scale, Globals.scale, Globals.scale);
      }
    }

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
