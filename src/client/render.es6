const _canvas = document.createElement('canvas');
_canvas.width = _resolution[0] * _scale;
_canvas.height = _resolution[1] * _scale;
document.body.appendChild(_canvas);
const _screen = _canvas.getContext("2d");

const _renderCallbacks = [];

function _render () {
  _screen.fillStyle = '#000';
  _screen.fillRect(0, 0, _resolution[0], _resolution[1]);

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
      _screen.fillRect(x * _scale, y * _scale, _scale, _scale);
    }
  }

  requestAnimationFrame(_render);
}

requestAnimationFrame(_render);
