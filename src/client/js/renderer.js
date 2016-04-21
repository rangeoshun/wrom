'use strict';
const Pixel = require('./pixel.js');

module.exports = class Renderer {



  constructor ( client ) {
    const renderer = this;
    const tick = client.game.tick;
    const globals = client.globals;
    const resolution = globals.resolution;
    const screen = globals.screen;
    const resolutionX = resolution[0];
    const resolutionY = resolution[1];

    const _background_canvas = document.createElement('canvas');
    _background_canvas.width = resolutionX;
    _background_canvas.height = resolutionY;

    const _background = _background_canvas.getContext("2d");
    _background.strokeStyle = '#0f0f0f';
/*
    _background.fillStyle = '#000';
    _background.fillRect(0, 0, resolutionX, resolutionY);
*/
    _background.translate(0.5, 0.5);

    for (let i = 0; i < resolutionX; i += 20) {
      _background.beginPath();
      _background.lineWidth = .5;
      _background.moveTo(i, 0);
      _background.lineTo(i, resolutionY);
      _background.stroke();
    }

    for (let i = 0; i < resolutionY; i += 20) {
      _background.beginPath();
      _background.lineWidth = .5;
      _background.moveTo(0, i);
      _background.lineTo(resolutionX, i);
      _background.stroke();
    }

    const backgroundImg = _background.getImageData(0, 0, resolutionX, resolutionY);

    const _world_canvas = document.createElement('canvas');
    _world_canvas.width = resolutionX;
    _world_canvas.height = resolutionY;
    const _world = _world_canvas.getContext("2d");
    _world.translate(0.5, 0.5);

    const _screen_canvas = document.createElement('canvas');
    const _screen = _screen_canvas.getContext("2d");
    _screen_canvas.width = screen[0];
    _screen_canvas.height = screen[1];
    _screen_canvas.className = 'screen';

    const _buffer_canvas = document.createElement('canvas');
    const _buffer = _buffer_canvas.getContext("2d");
    _buffer_canvas.width = resolution[0] * 2;
    _buffer_canvas.height = resolution[1] * 2;

    const _small_buffer_canvas = document.createElement('canvas');
    const _small_buffer = _small_buffer_canvas.getContext("2d");
    _small_buffer_canvas.width = screen[0];
    _small_buffer_canvas.height = screen[0];

    const _renderCallbacks = globals.renderCallbacks;
    const setupNode = document.querySelector('[id=setup]');
    const screenNode = document.querySelector('[id=screen]');
    screenNode.appendChild(_screen_canvas);

    _background.mozImageSmoothingEnabled = false;
    _background.webkitImageSmoothingEnabled = false;
    _background.msImageSmoothingEnabled = false;
    _background.imageSmoothingEnabled = false;

    _world.mozImageSmoothingEnabled = false;
    _world.webkitImageSmoothingEnabled = false;
    _world.msImageSmoothingEnabled = false;
    _world.imageSmoothingEnabled = false;

    _screen.mozImageSmoothingEnabled = false;
    _screen.webkitImageSmoothingEnabled = false;
    _screen.msImageSmoothingEnabled = false;
    _screen.imageSmoothingEnabled = false;

    _buffer.mozImageSmoothingEnabled = false;
    _buffer.webkitImageSmoothingEnabled = false;
    _buffer.msImageSmoothingEnabled = false;
    _buffer.imageSmoothingEnabled = false;

/*
    document.body.appendChild(_world_canvas);
    document.body.appendChild(_buffer_canvas);
*/

    let renderedPixel = _world.createImageData(1, 1);
    let pixelData = renderedPixel.data;
    let tempPixel = new Pixel();
    renderer.drawLine = function ( v1, v2, color, alphaFactor ) {
      alphaFactor = typeof alphaFactor === 'number' ? alphaFactor : 1;
      const x1 = v1[0];
      const y1 = v1[1];
      const x2 = v2[0];
      const y2 = v2[1];

      const dx =  x1 - x2;
      const adx = Math.abs(dx);
      const dy = y1 - y2;
      const ady = Math.abs(dy);
      const dim =  adx > ady ? 1 : 0;
      const length = dim ? adx : ady;
      let x = x1;
      let y = y1;

      const stepX = dx/length;
      const stepY = dy/length;
      let coords = [];

      for (let i = 1; i < length + 1; i++) {

        coords[0] = Math.round(x -= stepX);
        coords[1] = Math.round(y -= stepY);
        currentBounds = isInNormalizedBounds(coords, normBounds);
        if (currentBounds.touched) {
          tempPixel.setColor(color).setCoords(coords);
          pixelData[0] = tempPixel.r;
          pixelData[1] = tempPixel.g;
          pixelData[2] = tempPixel.b;
          pixelData[3] = 255 * alphaFactor;
          //console.log(currentBounds[2])
          _world.putImageData(renderedPixel, x, y );
        }
      }
    };

    let self;
    let body;
    let head;
    let scaleY;
    let scaleX;
    let startY;
    let endY;
    let dimensionY;
    let startX;
    let endX;
    let dimensionX;
    let start;
    let end;
    let backupHead = [0,0];
    let backupBody = [backupHead];
    let getBoundCoords = function getBoundCoords () {
      self = globals.self;
      body = self.body || backupBody;
      head = body[0] || backupHead;
      backupHead = head;
      scaleY = globals.screen[1] / 2;
      scaleX = Math.round(scaleY * 1.6);
      startY = head[1] - scaleY;
      endY = head[1] + scaleY;
      dimensionY = endY - startY;
      startX = head[0] - scaleX;
      endX = head[0] + scaleX;
      dimensionX = endX - startX;
      start = [startX, startY];
      end = [endX, endY];
      return [start, end, dimensionX, dimensionY];
    }

    let deleteCue = [];
    let deleteCueLength;

    let callback;
    let pixels;
    let pixelsLength;
    let pixel;
    let x;
    let y;

    let segment0 = [[],[],[]];
    let segment1 = [[],[],[]];
    let segment2 = [[],[],[]];
    let segment3 = [[],[],[]];
    let segment4 = [[],[],[]];
    let segment5 = [[],[],[]];
    let segment6 = [[],[],[]];
    let segment7 = [[],[],[]];
    let segment8 = [[],[],[]];
    let whereToRender;

    let normBounds = [
      segment0,
      segment1,
      segment2,
      segment3,
      segment4,
      segment5,
      segment6,
      segment7,
      segment8
    ];
    const normBoundsLength = normBounds.length;

    let normalizeBounds = function normalizeBounds ( bounds ) {
      let subX;
      let subY;
      let superX;
      let superY;

      if (bounds[0][0] < 0) {

        subX = resolutionX + bounds[0][0];
        bounds[0][0] = 0;
      }

      if (bounds[1][0] > resolutionX) {

        superX = bounds[1][0] - resolutionX;
        bounds[1][0] = resolutionX;
      }

      if (bounds[0][1] < 0) {

        subY = resolutionY + bounds[0][1];
        bounds[0][1] = 0;
      }

      if (bounds[1][1] > resolutionY) {

        superY = bounds[1][1] - resolutionY;
        bounds[1][1] = resolutionY;
      }

      for (let i = 0; i < 9; i++) {
        const currentBounds = normBounds[i];
        currentBounds.touched = 0;
      }

      if (subX && subY) {
        segment0[0] = [subX, subY],
        segment0[1] = [resolutionX, resolutionY]
        segment0.touched = 1;
      }

      if (subY) {
        segment1[0] = [bounds[0][0], subY],
        segment1[1] = [bounds[1][0], resolutionY]
        segment1.touched = 1;
      }

      if (superX && subY) {
        segment2[0] = [0, subY];
        segment2[1] = [superX, resolutionY];
        segment2.touched = 1;
      }

      if (subX) {
        segment3[0] = [subX, bounds[0][1]],
        segment3[1] = [resolutionX, bounds[1][1]]
        segment3.touched = 1;
      }

      segment4[0] = bounds[0];
      segment4[1] = bounds[1];
      segment4.touched = 1;

      if (superX) {
        segment5[0] = [0, bounds[0][1]];
        segment5[1] = [superX, bounds[1][1]];
        segment5.touched = 1;
      }

      if (subX && superY) {
        segment6[0] = [subX, 0];
        segment6[1] = [resolutionX, superY];
        segment6.touched = 1;
      }

      if (superY) {
        segment7[0] = [bounds[0][0], 0];
        segment7[1] = [bounds[1][0], superY];
        segment7.touched = 1;
      }

      if (superX && superY) {
        segment8[0] = [0, 0];
        segment8[1] = [superX, superY];
        segment8.touched = 1;
      }

      if (segment0.touched) {
        whereToRender = segment0[2];
        whereToRender[0] = 0;
        whereToRender[1] = 0;
        if (segment8.touched) {
          whereToRender[0] += segment8[1][0] - segment8[0][0];
        }

        if (segment5.touched) {
          whereToRender[1] += segment5[1][0] - segment5[0][0];
        }
      }

      if (segment1.touched) {
        whereToRender = segment1[2];
        whereToRender[0] = 0;
        whereToRender[1] = 0;

        if (segment0.touched) {
          whereToRender[0] += segment0[1][0] - segment0[0][0];
        }
      }

      if (segment2.touched) {
        whereToRender = segment2[2];
        whereToRender[0] = 0;
        whereToRender[1] = 0;
        if (segment0.touched) {
          whereToRender[0] += segment0[1][0] - segment0[0][0];
        }

        if (segment1.touched) {
          whereToRender[0] += segment1[1][0] - segment1[0][0];
        }
      }

      if (segment3.touched) {
        whereToRender = segment3[2];
        whereToRender[0] = 0;
        whereToRender[1] = 0;
        if (segment0.touched) {
          whereToRender[1] += segment0[1][1] - segment0[0][1];
        }
      }

      if (segment4.touched) {
        whereToRender = segment4[2];
        whereToRender[0] = 0;
        whereToRender[1] = 0;
        if (segment0.touched) {
          whereToRender[1] += segment0[1][1] - segment0[0][1];
        } else if (segment1.touched) {
          whereToRender[1] += segment1[1][1] - segment1[0][1];
        } else if (segment2.touched && segment5.touched) {
          whereToRender[0] += segment5[1][0] - segment5[0][0];
        }

        if (segment3.touched) {
          whereToRender[0] += segment3[1][0] - segment3[0][0];
        }
      }

      if (segment5.touched) {
        whereToRender = segment5[2];
        whereToRender[0] = 0;
        whereToRender[1] = 0;
        if (segment0.touched) {
          whereToRender[0] += segment0[1][0] - segment0[0][0];
          whereToRender[1] += segment0[1][1] - segment0[0][1];
        }

        if (segment4.touched) {
          whereToRender[0] += segment4[1][0] - segment4[0][0];
        }

        if (segment2.touched) {
          whereToRender[1] += segment2[1][1] - segment2[0][1];
        }
      }

      if (segment6.touched) {
        whereToRender = segment6[2];
        whereToRender[0] = 0;
        whereToRender[1] = 0;
        if (segment0.touched) {
          whereToRender[1] += segment0[1][1] - segment0[0][1];
        }

        if (segment3.touched) {
          whereToRender[1] += segment3[1][1] - segment3[0][1];
        }
      }

      if (segment7.touched) {
        whereToRender = segment7[2];
        whereToRender[0] = 0;
        whereToRender[1] = 0;
        if (segment4.touched) {
          whereToRender[1] += segment4[1][1] - segment4[0][1];
        } else if (segment3.touched) {
          whereToRender[1] += segment3[1][1] - segment3[0][1];
        }

        if (segment6.touched) {
          whereToRender[0] += segment6[1][0] - segment6[0][0];
        }
      }

      if (segment8.touched) {
        whereToRender = segment8[2];
        whereToRender[0] = 0;
        whereToRender[1] = 0;
        if (segment4.touched) {
          whereToRender[0] += segment4[1][0] - segment4[0][0];
        }

        if (segment5.touched) {
          whereToRender[1] += segment5[1][1] - segment5[0][1];
        }
      }
    }

    let isInNormalizedBounds = function isInNormalizedBounds ( pixelCoords ) {

      const x = pixelCoords[0];
      const y = pixelCoords[1];
      let verdict = false;

      for (let i = 0; i < normBoundsLength; i++) {
        let bounds = normBounds[i];
        if (bounds.touched) {
/*
        _world.strokeStyle = '#222';
        _world.strokeRect(bounds[0][0],bounds[0][1],bounds[1][0] - bounds[0][0],bounds[1][1] - bounds[0][1]);
*/
        if (x >= bounds[0][0]
          && x <= bounds[1][0]
          && y >= bounds[0][1]
          && y <= bounds[1][1]) {

            return bounds;
          }
        }
      }

      return false;
    }

    let currentBounds;
    function render () {

      if (client.state === 'screen') {
        _world.clearRect(0,0,resolutionX,resolutionY);
        _world.putImageData(backgroundImg, 0, 0);
        //      console.log(bounds)

        const callbackLength = _renderCallbacks.length;
        normalizeBounds(getBoundCoords());
        for (let i = 0; i < callbackLength; i++) {
          callback = _renderCallbacks[i];
          pixels = callback(_world, renderer);
          pixelsLength = pixels.length;

          for (let k = 0; k < pixelsLength; k++) {

            pixel = pixels[k];
            if (pixel[4]) {

              x = pixel[4][0];
              y = pixel[4][1];

              currentBounds = isInNormalizedBounds(pixels[k][4], normBounds);
              if (currentBounds.touched) {
                pixelData[0] = pixel.r;
                pixelData[1] = pixel.g;
                pixelData[2] = pixel.b;
                pixelData[3] = 255;
                //console.log(currentBounds[2])
                _world.putImageData(renderedPixel, x, y );
              }
            }
          }
          if (pixels.die) {
            deleteCue.push(callback);
          }
          pixels = null;
        }

        deleteCueLength = deleteCue.length;
        for (let d = 0; d < deleteCueLength; d++) {
          _renderCallbacks.splice(_renderCallbacks.indexOf(deleteCue[d]), 1);
        }
        deleteCue = [];
      }

      //_buffer.clearRect(0,0,resolutionX*2,resolutionY*2);

/*
      let screenOffset;
      if (segment0.touched) screenOffset = segment0[0];
      else if (segment1.touched) screenOffset = segment1[0];
      else if (segment3.touched) screenOffset = segment3[0];
      else screenOffset = segment4[0];
      _small_buffer.clearRect(0,0, screen[0], screen[1]);
      _small_buffer.drawImage(_world_canvas, 0 - screenOffset[0], 0 - screenOffset[1]);
      _small_buffer.drawImage(_world_canvas, resolutionX - screenOffset[0], 0 - screenOffset[1]);
      _small_buffer.drawImage(_world_canvas, 0 - screenOffset[0], resolutionY - screenOffset[1]);
      _small_buffer.drawImage(_world_canvas, resolutionX - screenOffset[0], resolutionY - screenOffset[1]);
//      _small_buffer.drawImage(_buffer_canvas, 0 - screenOffset[0], 0 - screenOffset[1]);

      _screen.clearRect(0,0, screen[0], screen[1]);
      _screen.drawImage(_small_buffer_canvas, 0, 0);
      */

      for (let i = 0; i < normBoundsLength; i++) {
        let segment = normBounds[i];
        if (segment.touched) {
          _screen.putImageData(
            _world.getImageData(
              segment[0][0],
              segment[0][1],
              segment[1][0],
              segment[1][1]
            ),
              segment[2][0],
              segment[2][1]
          );
        }
      }
      requestAnimationFrame(render);
    }

  requestAnimationFrame(render);
  }
}
