const colors = require('./colors.js');
const Pixel = require('./pixel.js');
let colorPicker = new Pixel();

module.exports = function ( $scope ) {
  $scope.colors = [];
  $scope.playerColor = $scope.globals.user.color || false;

  $scope.isSelected = function ( item ) {
    return item.selected ? '#fff' : 'transparent';
  };

  $scope.changeColor = function ( colorArray ) {
    $scope.colors.forEach(function ( color ) {
      if (color.array === colorArray) color.selected = true;
      else color.selected = false;
    });
    $scope.$emit('changeColor', colorArray);
  };

  for (let colorName in colors) {
    const colorArray = colors[colorName];
    colorPicker.setColor(colorArray);

    $scope.colors.push({
      name: colorName,
      hex: colorPicker.getHex(),
      array: colorArray,
      selected: JSON.stringify(colorArray) === JSON.stringify($scope.playerColor)
    });
  }

  $scope.playerColor = $scope.playerColor || $scope.colors[Math.round(Math.random()*$scope.colors.length)].array;
  $scope.$emit('changeColor', $scope.playerColor);
}
