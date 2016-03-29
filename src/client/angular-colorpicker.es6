const colors = require('./colors.js');
const Pixel = require('./pixel.js');
let colorPicker = new Pixel();

module.exports = function ( $scope ) {
  $scope.colors = [];
  for (let colorName in colors) {
    const colorArray = colors[colorName];
    colorPicker[1] = colorArray[0];
    colorPicker[2] = colorArray[1];
    colorPicker[3] = colorArray[2];

    $scope.colors.push({
      name: colorName,
      hex: colorPicker.getHex(),
      array: colorArray
    });

    $scope.changeColor = function ( colorArray ) {
      $scope.$emit('changeColor', colorArray);
    };
  }
}
