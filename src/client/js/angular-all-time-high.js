module.exports = function ( $scope, $filter ) {
  $scope.$on('athUpdate', function ( ev, scores ) {
    $scope.athScores = scores;
  });
};
