'use strict';

module.exports = class Renderer {
  constructor ( client ) {
    const renderer = this;
    const globals = client.globals;
    const resolution = globals.resolution;
    const resolutionX = resolution[0];
    const resolutionY = resolution[1];

    const _background_canvas = document.createElement('canvas');
    _background_canvas.width = resolutionX;
    _background_canvas.height = resolutionY;

    const _background = _background_canvas.getContext("2d");
    _background.strokeStyle = '#222';
    _background.fillStyle = '#000';
    _background.fillRect(0,0,resolutionX, resolutionY);

    for (let i = 1; i < resolutionX; i += 10) {
      _background.beginPath();
      _background.lineWidth = .5;
      _background.moveTo(i, 0);
      _background.lineTo(i, resolutionY);
      _background.stroke();
    }

    for (let i = 1; i < resolutionY; i += 10) {
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

    const _screen_canvas = document.createElement('canvas');
    const _screen = _screen_canvas.getContext("2d");
    _screen_canvas.width = globals.screen[0];
    _screen_canvas.height = globals.screen[1];
    _screen_canvas.className = 'screen';

    const _renderCallbacks = globals.renderCallbacks;
    const setupNode = document.querySelector('[id=setup]');
    const screenNode = document.querySelector('[id=screen]');
    screenNode.appendChild(_screen_canvas);

    //  document.body.appendChild(_world_canvas);
    let getBoundCoords = function getBoundCoords () {
      const self = globals.self;
      const body = self.body;
      const head = body[0];
      const scaleY = globals.screen[1] / 2;
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

    let normalizeBounds = function normalizeBounds ( bounds ) {
      let normBounds = [];
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

      if (subX && subY) {
        normBounds[0] = [
          [subX, subY],
          [resolutionX, resolutionY]
        ];
      }

      if (subY) {
        normBounds[1] = [
          [bounds[0][0], subY],
          [bounds[1][0], resolutionY]
        ];
      }

      if (superX && subY) {
        normBounds[2] = [
          [0, subY],
          [superX, resolutionY]
        ];
      }

      if (subX) {
        normBounds[3] = [
          [subX, bounds[0][1]],
          [resolutionX, bounds[1][1]]
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
          [resolutionX, superY]
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

    let isInNormalizedBounds = function isInNormalizedBounds ( pixelCoords, normBounds ) {
      const x = pixelCoords[0];
      const y = pixelCoords[1];
      const normBoundsLength = normBounds.length;
      let verdict = false;

      for (let i = 0; i < normBoundsLength; i++) {
        let bounds = normBounds[i];
        if (bounds) {
        /*
        _world.strokeStyle = '#222';
        _world.strokeRect(bounds[0][0],bounds[0][1],bounds[1][0] - bounds[0][0],bounds[1][1] - bounds[0][1);
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

    let renderSegmentOnScreen = function renderSegmentOnScreen ( bounds, where ) {
      const entitiesImg = _world.getImageData(bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1]);
      _screen.putImageData(entitiesImg, where[0], where[1]);
    }

    let renderedPixel = _world.createImageData(1, 1);
    let pixelData = renderedPixel.data;
    let deleteCue = [];
    let deleteCueLength;
    let callback;
    let pixels;
    let pixelsLength;
    let pixel;
    let segment0;
    let segment1;
    let segment2;
    let segment3;
    let segment4;
    let segment5;
    let segment6;
    let segment7;
    let segment8;
    let whereToRender = [0, 0];

    function render () {

      if (client.state === 'screen') {

        _world.putImageData(backgroundImg, 0, 0);
        //      console.log(bounds)
        const callbackLength = _renderCallbacks.length;
        let normBounds = normalizeBounds(getBoundCoords());

        for (let i = 0; i < callbackLength; i++) {
          callback = _renderCallbacks[i];

          for (let k = 0; k < pixelsLength; k++) {

            pixels = callback(_screen);
            pixelsLength = pixels.length;
            pixel = pixels[k];
            x = pixel[4][0];
            y = pixel[4][1];

            if (isInNormalizedBounds([x, y], normBounds)) {
              pixelData[0] = pixel.r();
              pixelData[1] = pixel.g();
              pixelData[2] = pixel.b();
              pixelData[3] = 255;
              _world.putImageData(renderedPixel, x, y);

              /*
              const color = pixel.getHex();
              _world.fillStyle = color;
              _world.fillRect(x, y, 1, 1);
              */
            }

            if (pixels.die) {
              deleteCue.push(callback);
            }
          }

        }

        segment0 = normBounds[0];
        segment1 = normBounds[1];
        segment2 = normBounds[2];
        segment3 = normBounds[3];
        segment4 = normBounds[4];
        segment5 = normBounds[5];
        segment6 = normBounds[6];
        segment7 = normBounds[7];
        segment8 = normBounds[8];
        whereToRender = [0, 0];

        if (segment0) {
          whereToRender = [0, 0];
          if (segment8) {
            whereToRender[0] += segment8[1][0] - segment8[0][0];
          }

          if (segment5) {
            whereToRender[1] += segment5[1][0] - segment5[0][0];
          }
          renderSegmentOnScreen(segment0, whereToRender);
        }

        if (segment1) {
          whereToRender = [0, 0];
          if (segment0) {
            whereToRender[0] += segment0[1][0] - segment0[0][0];
          }
          renderSegmentOnScreen(segment1, whereToRender);
        }

        if (segment2) {
          whereToRender = [0, 0];
          if (segment0) {
            whereToRender[0] += segment0[1][0] - segment0[0][0];
          }

          if (segment1) {
            whereToRender[0] += segment1[1][0] - segment1[0][0];
          }
          renderSegmentOnScreen(segment2, whereToRender);
        }

        if (segment3) {
          whereToRender = [0, 0];
          if (segment0) {
            whereToRender[1] += segment0[1][1] - segment0[0][1];
          }
          renderSegmentOnScreen(segment3, whereToRender);
        }

        if (segment4) {
          whereToRender = [0, 0];
          if (segment0) {
            whereToRender[1] += segment0[1][1] - segment0[0][1];
          } else if (segment1) {
            whereToRender[1] += segment1[1][1] - segment1[0][1];
          } else if (segment2 && segment5) {
            whereToRender[0] += segment5[1][0] - segment5[0][0];
          }

          if (segment3) {
            whereToRender[0] += segment3[1][0] - segment3[0][0];
          }
          renderSegmentOnScreen(segment4, whereToRender);
        }

        if (segment5) {
          whereToRender = [0, 0];
          if (segment0) {
            whereToRender[0] += segment0[1][0] - segment0[0][0];
            whereToRender[1] += segment0[1][1] - segment0[0][1];
          }

          if (segment4) {
            whereToRender[0] += segment4[1][0] - segment4[0][0];
          }

          if (segment2) {
            whereToRender[1] += segment2[1][1] - segment2[0][1];
          }
          renderSegmentOnScreen(segment5, whereToRender);
        }

        if (segment6) {
          whereToRender = [0, 0];
          if (segment0) {
            whereToRender[1] += segment0[1][1] - segment0[0][1];
          }

          if (segment3) {
            whereToRender[1] += segment3[1][1] - segment3[0][1];
          }
          renderSegmentOnScreen(segment6, whereToRender);
        }

        if (segment7) {
          whereToRender = [0, 0];
          if (segment4) {
            whereToRender[1] += segment4[1][1] - segment4[0][1];
          } else if (segment3) {
            whereToRender[1] += segment3[1][1] - segment3[0][1];
          }

          if (segment6) {
            whereToRender[0] += segment6[1][0] - segment6[0][0];
          }
          renderSegmentOnScreen(segment7, whereToRender);
        }

        if (segment8) {
          if (segment4) {
            whereToRender = [0, 0];
            whereToRender[0] += segment4[1][0] - segment4[0][0];
          }

          if (segment5) {
            whereToRender[1] += segment5[1][1] - segment5[0][1];
          }
          renderSegmentOnScreen(segment8, whereToRender);
        }

        normBounds = null;
      }

      deleteCueLength = deleteCue.length;
      for (let i = 0; i < deleteCueLength; i++) {
        _renderCallbacks.splice(_renderCallbacks.indexOf(deleteCue[i]), 1);
      }
      deleteCue = [];

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }
}
