let _matrix = [];
let _resolution = [64, 64];
let _fps = 24;
let _callbacks = [];
let _scale = 10;

// init matrix
function initMatrix () {
  for (let i = 0; i < _resolution[1]; i++) {
    var row = [];
    for (let k = 0; k < _resolution[0]; k++) {
      row.push(new Pixel(0, 0, 0, 0, [k, i]));
    }
    _matrix.push(row);
  }

  _callbacks.push(function ( pixel ) {
      pixel[1] = pixel[2] = pixel[3] = 0;
  });
}

function cycleMatrix ( pixelCallbacks, rowCallback ) {
  _matrix.forEach(rowCallback || function ( row, y ) {
    row.forEach(function ( pixel, x ) {
      pixelCallbacks.forEach(function ( callback, index ) {
        if (callback(pixel) === false) {
          pixelCallbacks.splice(index, 1);
        }
      });
    });
  });
}

function _isColliding ( v1, v2 ) {
  return v1[0] === v2[0] && v1[1] === v2[1];
}