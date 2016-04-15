const Colors = require('./colorpicker.js');

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

module.exports = function ( client ) {
  const nameInput = document.getElementById('name');

  client.on('changeName', function ( name ) {
    nameInput.value = name;
  });

  client.emit('changeName', client.globals.user.name || 'UNNAMED');

  function normalizeName ( name ) {
    if (!name) return '';
    name = name.slice(0, 15);
    for (let i = 0; i < name.length; i++) {
      const code = name.charCodeAt(i);
      if (code > 125) {
        name.replaceAt(i, '_');
        console.log(code, name)
      }
    }
    return name;
  }

  function handleNameChange ( ev ) {
    if (client.state !== 'setup') return;
    ev.preventDefault();

    let value = ev.target.value || '';
    const code = ev.keyCode;

    if (code < 125) {

      if (code !== 8) {
        value += String.fromCharCode(code);
      } else if (code === 13) {
        nameInput.blur();
        client.emit('goPlay');
      } else {
        value = value.slice(0, value.length - 1);
      }

    } else if (code === 189) {
      value += '-';
    } else if (code === 192) {
      value += '_';
    }

    value = normalizeName(value);
    client.emit('changeName', value);
  }

  nameInput.addEventListener('keydown', function ( ev ) {
    if (client.state !== 'setup') return;
    ev.preventDefault();
  });

  nameInput.addEventListener('keyup', handleNameChange);

  document.getElementById('goPlay').addEventListener('click', function () {
    client.emit('goPlay');
  });

  new Colors(client);
}
