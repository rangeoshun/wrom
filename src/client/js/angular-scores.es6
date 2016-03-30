module.exports = function ( $scope, $filter ) {
  $scope.$on('update', function () {
    $scope.$apply(function () {
      $scope.highScores = $filter('orderScores')($scope.game.players.map(function ( player ) {
        return {
          name: player.name || player.id,
          score: player.score
        };
      }));
    });
  });
};
