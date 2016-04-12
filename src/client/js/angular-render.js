'use strict';

const Globals = require('./globals.js');

module.exports = function ( $scope ) {
  const globals = $scope.globals;
  const resolution = globals.resolution;

  const _background_canvas = document.createElement('canvas');
  _background_canvas.width = resolution[0];
  _background_canvas.height = resolution[1];

  const _background = _background_canvas.getContext("2d");
  _background.strokeStyle = '#222';

  const _world_canvas = document.createElement('canvas');
  _world_canvas.width = resolution[0];
  _world_canvas.height = resolution[1];
  const _world = _world_canvas.getContext("2d");

  for (let i = 1; i < resolution[0]; i += 10) {
    _background.beginPath();
    _background.lineWidth = .5;
    _background.moveTo(i, 0);
    _background.lineTo(i, resolution[1]);
    _background.stroke();
  }

  for (let i = 1; i < resolution[1]; i += 10) {
    _background.beginPath();
    _background.lineWidth = .5;
    _background.moveTo(0, i);
    _background.lineTo(resolution[0], i);
    _background.stroke();
  }
  const backgroundImg = _background.getImageData(0, 0, resolution[0], resolution[1]);

  const _screen_canvas = document.createElement('canvas');
  const _screen = _screen_canvas.getContext("2d");
  _screen_canvas.className = 'screen';

  const _renderCallbacks = Globals.renderCallbacks;
  const setupNode = document.querySelector('[ng-controller=setup]');
  const screenNode = document.querySelector('[ng-controller=screen]');
  screenNode.appendChild(_screen_canvas);

//  document.body.appendChild(_world_canvas);

  let deleteCue = [];

  function getBoundCoords () {
    const globals = $scope.globals;
    const self = globals.self;
    const body = self.body;
    const head = body[0];
    const length = body.length;
    const minX = 160;
    const minY = 100;
    const scaleY = Math.round(Math.max(minY / 2, length)) + 1;
    const scaleX = Math.round(scaleY * 1.6);
    const startY = head[1] - scaleY;
    const endY = head[1] + scaleY;
    const dimensionY = endY - startY;
    const startX = head[0] - scaleX;
    const endX = head[0] + scaleX;
    const dimensionX = endX - startX;
    const start = [startX, startY];
    const end = [endX, endY];
    return [start, end, dimensionX, dimensionY];
  }

  function normalizeBounds ( bounds ) {
    let normBounds = [];
    let subX;
    let subY;
    let superX;
    let superY;

    if (bounds[0][0] < 0) {

      subX = resolution[0] + bounds[0][0];
      bounds[0][0] = 0;
    }

    if (bounds[1][0] > resolution[0]) {

      superX = bounds[1][0] - resolution[0];
      bounds[1][0] = resolution[0];
    }

    if (bounds[0][1] < 0) {

      subY = resolution[1] + bounds[0][1];
      bounds[0][1] = 0;
    }

    if (bounds[1][1] > resolution[1]) {

      superY = bounds[1][1] - resolution[1];
      bounds[1][1] = resolution[1];
    }

    if (subX && subY) {
      normBounds[0] = [
        [subX, subY],
        [resolution[0], resolution[1]]
      ];
    }

    if (subY) {
      normBounds[1] = [
        [bounds[0][0], subY],
        [bounds[1][0], resolution[1]]
      ];
    }

    if (superX && subY) {
      normBounds[2] = [
        [0, subY],
        [superX, resolution[1]]
      ];
    }

    if (subX) {
      normBounds[3] = [
        [subX, bounds[0][1]],
        [resolution[0], bounds[1][1]]
      ];
    }

    normBounds[4] = [bounds[0], bounds[1]];

    if (superX) {
      normBounds[5] = [
        [0, bounds[0][1]],
        [superX, bounds[1][1]]
      ];
    }

    if (subX && superY) {
      normBounds[6] = [
        [subX, 0],
        [resolution[0], superY]
      ];
    }

    if (superY) {
      normBounds[7] = [
        [bounds[0][0], 0],
        [bounds[1][0], superY]
      ];
    }

    if (superX && superY) {
      normBounds[8] = [
        [0, 0],
        [superX, superY]
      ];
    }

    return normBounds;
  }

  function isInNormalizedBounds ( pixelCoords, normBounds ) {
    const x = pixelCoords[0];
    const y = pixelCoords[1];
    let verdict = false;

    for (let i = 0; i < normBounds.length; i++) {
      let bounds = normBounds[i];
      if (bounds) {
/*
        _world.strokeStyle = '#222';
        _world.strokeRect(bounds[0][0],bounds[0][1],bounds[1][0] - bounds[0][0],bounds[1][1] - bounds[0][1]);
*/
        if (x >= bounds[0][0]
          && x <= bounds[1][0]
          && y >= bounds[0][1]
          && y <= bounds[1][1]) {

          return true;
        }
      }
    }

    return false;
  }

  function render () {
    _world.fillStyle = '#000';
    _world.fillRect(0,0,resolution[0], resolution[1]);
    const globals = $scope.globals;
    _world.putImageData(backgroundImg, 0, 0);

    if ($scope.state === 'screen') {
      const bounds = getBoundCoords();
//      console.log(bounds)
      const normBounds = normalizeBounds(bounds);

      if (_screen_canvas.width !== bounds[2]) {
        _screen_canvas.width = bounds[2];
        _screen_canvas.height = bounds[3];
      }

      for (let i = 0; i < _renderCallbacks.length; i++) {
        const callback = _renderCallbacks[i];
        const pixels = callback(_screen);

        for (let k = 0; k < pixels.length; k++) {

          const pixel = pixels[k];
          const x = pixel[4][0];
          const y = pixel[4][1];
isInNormalizedBounds([x, y], normBounds)
          if (isInNormalizedBounds([x, y], normBounds)) {

            const color = pixel.getHex();

            _world.fillStyle = color;
            _world.fillRect(x, y, 1, 1);
          }
        }

        if (pixels.die) {
          deleteCue.push(callback);
        }
      }

      let boundsDrawn = [0, 0];
      normBounds.forEach(function ( bounds, index ) {
        if (!bounds) return;
        let renderedSize = [bounds[1][0] - bounds[0][0], bounds[1][0] - bounds[0][0]];
        let whereToRender = [0, 0];
        boundsDrawn.push(index);

        switch (index) {
          case 0:
            if (normBounds[8]) {
              whereToRender[0] += normBounds[8][1][0] - normBounds[8][0][0];
            }

            if (normBounds[6]) {
              whereToRender[1] += normBounds[5][1][0] - normBounds[5][0][0];
            }
          break;
          case 1:
            if (normBounds[0]) {
              whereToRender[0] += normBounds[0][1][0] - normBounds[0][0][0];
            }
          break;
          case 2:
            if (normBounds[0]) {
              whereToRender[0] += normBounds[0][1][0] - normBounds[0][0][0];
            }

            if (normBounds[1]) {
              whereToRender[0] += normBounds[1][1][0] - normBounds[1][0][0];
            }
          break;
          case 3:
            if (normBounds[0]) {
              whereToRender[1] += normBounds[0][1][1] - normBounds[0][0][1];
            }
          break;
          case 4:
            if (normBounds[0]) {
              whereToRender[1] += normBounds[0][1][1] - normBounds[0][0][1];
            } else if (normBounds[1]) {
              whereToRender[1] += normBounds[1][1][1] - normBounds[1][0][1];
            } else if (normBounds[2] && normBounds[5]) {
              whereToRender[0] += normBounds[5][1][0] - normBounds[5][0][0];
            }

            if (normBounds[3]) {
              whereToRender[0] += normBounds[3][1][0] - normBounds[3][0][0];
            }
          break;
          case 5:
            if (normBounds[0]) {
              whereToRender[0] += normBounds[0][1][0] - normBounds[0][0][0];
              whereToRender[1] += normBounds[0][1][1] - normBounds[0][0][1];
            }

            if (normBounds[4]) {
              whereToRender[0] += normBounds[4][1][0] - normBounds[4][0][0];
            }

            if (normBounds[2]) {
              whereToRender[1] += normBounds[2][1][1] - normBounds[2][0][1];
            }

          break;
          case 6:
            if (normBounds[0]) {
              whereToRender[1] += normBounds[0][1][1] - normBounds[0][0][1];
            }

            if (normBounds[3]) {
              whereToRender[1] += normBounds[3][1][1] - normBounds[3][0][1];
            }
          break;
          case 7:

            if (normBounds[4]) {
              whereToRender[1] += normBounds[4][1][1] - normBounds[4][0][1];
            } else if (normBounds[3]) {
              whereToRender[1] += normBounds[3][1][1] - normBounds[3][0][1];
            }

            if (normBounds[6]) {
              whereToRender[0] += normBounds[6][1][0] - normBounds[6][0][0];
            }
          break;
          case 8:
            if (normBounds[4]) {
              whereToRender[0] += normBounds[4][1][0] - normBounds[4][0][0];
            }

            if (normBounds[5]) {
              whereToRender[1] += normBounds[5][1][1] - normBounds[5][0][1];
            }
          break;
        }

        const entitiesImg = _world.getImageData(bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1]);
        _screen.putImageData(entitiesImg, whereToRender[0], whereToRender[1]);
/*
        _screen.font = "20px serif";
        _screen.fillStyle = '#fff';
        _screen.fillText(index, whereToRender[0] + 5, whereToRender[1] + 20);
*/
      });
    }

    deleteCue.forEach(function ( callback ) {
      _renderCallbacks.splice(_renderCallbacks.indexOf(callback), 1);
    });

    deleteCue = [];
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
