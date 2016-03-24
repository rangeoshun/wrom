const _canvas = document.createElement('canvas');
_canvas.width = _resolution[0] * _scale;
_canvas.height = _resolution[1] * _scale;
document.body.appendChild(_canvas);
const _screen = _canvas.getContext("2d");

const _renderCallbacks = [];
function _render () {

  cycleMatrix(_callbacks);

  let lastNullIndex = -1;
  cycleMatrix([function ( pixel ) {

    let x = pixel.x();
    let y = pixel.y();
    let color = pixel.getHex();

    _screen.fillStyle = color;
    _screen.fillRect(x * _scale, y * _scale, _scale, _scale);
  }]);

  requestAnimationFrame(_render);
}

requestAnimationFrame(_render);
