module.exports = function ( $scope ) {
  $scope.$on('athUpdate', function ( ev, scores ) {
    $scope.athScores = scores;
  });
};
