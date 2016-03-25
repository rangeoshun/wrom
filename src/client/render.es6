const _screen_canvas = document.createElement('canvas');
_screen_canvas.className = 'screen';
_screen_canvas.width = _resolution[0] * _scale;
_screen_canvas.height = _resolution[1] * _scale;
document.body.appendChild(_screen_canvas);
const _screen = _screen_canvas.getContext("2d");

const _scores = document.createElement('code');
document.body.appendChild(_scores);

const _renderCallbacks = [];
let colorPicker = new Pixel(0,0,0,0,[0,0]);

function _renderScores ( players ) {
  if (!players) return;
  _scores.innerText = 0;

  const playersLength = players.length;

  players.sort((score0, score1) => score0 > score1 ? 1 : score0 < score1 ? -1 : 0);

  for (let i = 0; i < playersLength; i++) {
    const player = players[i];

    colorPicker[1] = player.color[0];
    colorPicker[2] = player.color[1];
    colorPicker[3] = player.color[2];

    _scores.fillStyle = colorPicker.getHex();
    _scores.innerText += `${player.id} - ${player.score || '-'}\n`;
  }
}

function _renderGame () {
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

  requestAnimationFrame(_renderGame);
}
requestAnimationFrame(_renderGame);
