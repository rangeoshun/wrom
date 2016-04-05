'use strict';

const Globals = require('./globals.js');

module.exports = function ( $scope ) {

  const _screen_canvas = document.createElement('canvas');
  const _screen = _screen_canvas.getContext("2d");
/*
  const _setup_canvas = document.createElement('canvas');
  const _setup = _setup_canvas.getContext("2d");
*/
//  const _screen_canvas = document.createElement('canvas');
  const _renderCallbacks = Globals.renderCallbacks;
  const setupNode = document.querySelector('[ng-controller=setup]');
  const screenNode = document.querySelector('[ng-controller=screen]');

  _screen_canvas.className = 'screen';
  _screen_canvas.width = Globals.resolution[0] * Globals.scale;
  _screen_canvas.height = Globals.resolution[1] * Globals.scale;
  screenNode.appendChild(_screen_canvas);
/*
  _setup_canvas.className = 'setup';
  _setup_canvas.width = Globals.resolution[0] * Globals.scale;
  _setup_canvas.height = Globals.resolution[1] * Globals.scale;
  setupNode.style.visibility = 'hidden';
  setupNode.appendChild(_setup_canvas);
*/
//  document.querySelector('[ng-controller=screen]').appendChild(_scores);

  function render () {

    let ditch = [];

    if ($scope.state === 'screen') {

      _screen.fillStyle = '#000';
      _screen.fillRect(0, 0, Globals.resolution[0], Globals.resolution[1]);

      for (let i = 0; i < _renderCallbacks.length; i++) {

        const callback = _renderCallbacks[i];
        const pixels = callback(_screen);

        for (let k = 0; k < pixels.length; k++) {
          const pixel = pixels[k];
          const x = pixel[4][0];
          const y = pixel[4][1];
          const color = pixel.getHex();

          _screen.fillStyle = color;
          _screen.fillRect(x * Globals.scale, y * Globals.scale, Globals.scale, Globals.scale);

        }

        if (pixels.die) {
          ditch.push(i);
        }
      }

    }
    
    for (let d = 0; d < ditch.length; d++) {
      _renderCallbacks.splice(ditch[d], 1);
    }
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
