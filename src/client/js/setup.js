const Colors = require('./colorpicker.js');

module.exports = function ( client ) {
  /*
  a.filter('checklength', function () {
    var prevInput;
    return function ( input ) {
      if (!input) return '';
      else if (input.length > 16) return input.substr(0, 16).toUpperCase();
      else return input.toUpperCase();
    };
  })
  client.controller('colors', ['$scope', colors]);

  $scope.namePattern = /[a-zA-Z1-9-']+/g;
  $scope.playerName = $scope.globals.user.name || 'UNNAMED';
  $scope.emit('changeName', $scope.playerName);

  $scope.changeName = function () {
    $scope.playerName = $filter('checklength')($scope.playerName);
    $scope.emit('changeName', $scope.playerName || 'UNNAMED');
    return $scope.playerName;
  };

  $scope.goPlay = function () {
    $scope.emit('goPlay');
  };
  */

  document.getElementById('goPlay').addEventListener('click', function () {
    client.emit('goPlay');
  });
}
