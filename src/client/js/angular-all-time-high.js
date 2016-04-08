module.exports = function ( $scope ) {
  $scope.athScore = [{"pa":1,"so":10,"nm":"RANGE"},{"pa":2,"so":100000,"nm":"RANGEASDASDASDAS"}];

  $scope.$on('athUpdate', function ( ev, scores ) {
    $scope.athScores = scores;
  });
};
