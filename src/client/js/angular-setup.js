module.exports = function ( $scope, $filter ) {
  $scope.namePattern = /[a-zA-Z1-9-']+/g;
  $scope.playerName = $scope.globals.user.name || 'UNNAMED';
  $scope.$emit('changeName', $scope.playerName);

  $scope.changeName = function () {
    $scope.playerName = $filter('checklength')($scope.playerName);
    $scope.$emit('changeName', $scope.playerName || 'UNNAMED');
    return $scope.playerName;
  };

  $scope.goPlay = function () {
    $scope.$emit('goPlay');
  };
}
