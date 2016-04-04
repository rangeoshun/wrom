module.exports = function ( $scope, $filter ) {
  $scope.$on('update', function ( ev, scores ) {
    $scope.scores = $filter('orderScores')(scores);
    console.log($scope.scores)
  });
};
