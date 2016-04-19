const Colors = require('./colorpicker.js');

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

module.exports = function ( client ) {
  const nameInput = document.getElementById('name');
  const legalName = /[a-zA-Z0-9]|-|_|'|/g;
  const defaultName = 'UNNAMED';

  client.on('changeName', function ( name ) {
    nameInput.value = name;
  });

  client.emit('changeName', client.globals.user.name || defaultName);

  function normalizeName ( name ) {
    if (!name) return '';
    return name.slice(0, 15).match(legalName).join('');
  }

  function handleNameChange ( ev ) {
    if (client.state !== 'setup') return;

    let value = ev.target.value || '';

    value = normalizeName(value);
    client.emit('changeName', value);

    if (ev.keyCode === 13) {
      client.emit('goPlay');
    }
  }

  nameInput.addEventListener('keydown', handleNameChange);
  nameInput.addEventListener('keyup', handleNameChange);

  document.getElementById('goPlay').addEventListener('click', function () {
    client.emit('goPlay');
  });

  new Colors(client);
}
