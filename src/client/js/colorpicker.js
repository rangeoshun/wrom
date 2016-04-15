const colors = require('./colors.js');
const Pixel = require('./pixel.js');
let colorPicker = new Pixel();

module.exports = function ( client ) {
  const colorPalette = document.getElementById('colorPalette');
  client.colors = [];
  client.playerColor = client.globals.user.color || false;

  client.isSelected = function ( item ) {
    return item.selected ? '#000' : 'transparent';
  };

  function getColorSample ( name, color ) {
    return `<div
              id="color-${name}"
              class="color-sample"
              data-name="${name}"
              style="background-color:${colorPicker.setColor(color).hex};">

                &nbsp;
            </div>`;
  }

  for (let colorName in colors) {
    const color = colors[colorName]
    color[4] = colorName;
    client.colors.push(color);
    colorPalette.innerHTML += getColorSample(colorName, colors[colorName]);
  }

  for (let colorName in colors) {
    document.getElementById(`color-${colorName}`).addEventListener('click', function ( ev ) {
      const colorName = ev.target.dataset.name;
      client.emit('changeColor', colors[colorName], colorName);
    });
  }

  client.on('changeColor', function ( color, colorName ) {
    const colorSample = document.getElementById(`color-${colorName || color[4]}`);
    const selected = document.querySelector('.color-sample.selected');
    if (selected) selected.className = 'color-sample';
    if (colorSample) colorSample.className = 'color-sample selected';
  });

  const samples = document.querySelectorAll('.color-sample');
  const sampleLength = samples.length;

  client.globals.user.color = client.globals.user.color || client.colors[Math.round(Math.random()*client.colors.length)];
  client.emit('changeColor', client.globals.user.color, client.globals.user.color[4]);
}
