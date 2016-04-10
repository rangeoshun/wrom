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
  let deleteCue = [];
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

  function getBoundCoords () {
    const globals = $scope.globals;
    const self = globals.self;
    const body = self.body;
    const head = body[0];
    const length = body.length;
    const minX = 160;
    const minY = 100;
    const startY = head[1] - Math.max(minY / 2, length);
    const endY = head[1] + Math.max(minY / 2, length);
    const dimensionY = endY - startY;
    const startX = head[0] - Math.max(minX / 2, dimensionY / 2 * 1.6);
    const endX = head[0] + Math.max(minX / 2, dimensionY / 2 * 1.6);
    const dimensionX = endX - startX;
    const start = [startX, startY];
    const end = [endX, endY];
    return [start, end, dimensionX, dimensionY];
  }

  function render () {
    const globals = $scope.globals;

    if ($scope.state === 'screen') {
      const bounds = getBoundCoords();

      if (_screen_canvas.width !== bounds[2]) {
        _screen_canvas.width = bounds[2];
        _screen_canvas.height = bounds[3];
      }

      _screen.fillStyle = '#000';
      _screen.fillRect(0, 0, Globals.resolution[0], Globals.resolution[1]);

      for (let i = 0; i < _renderCallbacks.length; i++) {
        const callback = _renderCallbacks[i];
        const pixels = callback(_screen);

        for (let k = 0; k < pixels.length; k++) {

          const pixel = pixels[k];
          const x = pixel[4][0];
          const y = pixel[4][1];

          if (x >= bounds[0][0]
            && x <= bounds[1][0]
            && y >= bounds[0][1]
            && y <= bounds[1][1]) {

            const color = pixel.getHex();

            _screen.fillStyle = color;
            _screen.fillRect((x - bounds[0][0]) * Globals.scale, (y - bounds[0][1]) * Globals.scale, Globals.scale, Globals.scale);
          }
        }

        if (pixels.die) {
          deleteCue.push(callback);
        }
      }
    }

    deleteCue.forEach(function ( callback ) {
      _renderCallbacks.splice(_renderCallbacks.indexOf(callback), 1);
    });

    deleteCue = [];
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
