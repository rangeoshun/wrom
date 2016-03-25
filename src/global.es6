//let _matrix = [];
let _resolution = [96, 96];
let _fps = 60;
let _callbacks = [];
let _scale = 1;
/*
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

function cycleMatrix ( pixelCallbacks ) {
  const xResolution = _resolution[0];
  const yResolution = _resolution[1];
  const callbackLength = pixelCallbacks.length;

  for (let y = 0; y < yResolution; y++) {
    const row = _matrix[y];
    for (let x = 0; x < xResolution; x++) {
      const pixel = row[x];
      for (let i = 0; i < callbackLength; i++) {
        const callback = pixelCallbacks[i];
        if (!callback) return;

        if (callback(pixel) === false) {
          pixelCallbacks.splice(i, 1);
        }
      }
    }
  }
}
*/
function _isColliding ( v1, v2 ) {
  return v1[0] === v2[0] && v1[1] === v2[1];
}
