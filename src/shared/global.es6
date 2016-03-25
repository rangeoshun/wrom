//let _matrix = [];
let _resolution = [96, 96];
let _fps = 60;
let _callbacks = [];
let _scale = 1;

function _isColliding ( v1, v2 ) {
  return v1[0] === v2[0] && v1[1] === v2[1];
}
