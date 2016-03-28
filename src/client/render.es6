"use strict";

const Globals = require('./globals.js');
const Pixel = require('./pixel.js');

const _screen_canvas = document.createElement('canvas');
_screen_canvas.className = 'screen';
_screen_canvas.width = Globals.resolution[0] * Globals.scale;
_screen_canvas.height = Globals.resolution[1] * Globals.scale;
document.body.appendChild(_screen_canvas);
const _screen = _screen_canvas.getContext("2d");

const _scores = document.createElement('code');
document.body.appendChild(_scores);

const _renderCallbacks = Globals.renderCallbacks;
let colorPicker = new Pixel(0,0,0,0,[0,0]);

function _renderScores ( players ) {
  if (!players) return;
  _scores.innerText = 0;
  let scores = '';
  const playersLength = players.length;

  //players.sort((score0, score1) => score0 > score1 ? 1 : score0 < score1 ? -1 : 0);

  for (let i = 0; i < playersLength; i++) {
    const player = players[i];

    colorPicker[1] = player.color[0];
    colorPicker[2] = player.color[1];
    colorPicker[3] = player.color[2];

//    _scores.fillStyle = colorPicker.getHex();
    scores += `${player.id} - ${player.score || '-'}\n`;
  }
  _scores.innerText = scores;
}

function _renderGame () {
  _screen.fillStyle = '#000';
  _screen.fillRect(0, 0, Globals.resolution[0], Globals.resolution[1]);

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
      _screen.fillRect(x * Globals.scale, y * Globals.scale, Globals.scale, Globals.scale);
    }
  }

  requestAnimationFrame(_renderGame);
}
requestAnimationFrame(_renderGame);
