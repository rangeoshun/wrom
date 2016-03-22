class Game {
  constructor () {
    const game = this;
    game.points = [];
    game.players = [];
    game.paused = false;
  }

  togglePause () {
    const game = this;
    game.paused = !game.paused;
  }

  addPoint ( id ) {
    const game = this;
    let point = new Point();
    if (id) point.id = id;

    game.points.push(point);

    return point;
  }

  addPlayer ( id ) {
    const game = this;
    let player = new Worm();
    if (id) player.id = id;

    game.players.push(player);

    return player;
  }

  getPointById ( id ) {
    const game = this;
    let foundPoint = null;

    game.points.forEach(function ( point ) {
      if (id !== point.id) return;
      foundPoint = point;
    });

    return foundPoint;
  }

  getPlayerById ( id ) {
    const game = this;
    let foundPlayer = null;

    game.players.forEach(function ( player ) {
      if (id !== player.id) return;
      foundPlayer = player;
    });

    return foundPlayer;
  }

  getState () {
    const game = this;
    let state = {
      pl: {},
      po: {}
    };

    game.points.forEach(function ( point ) {
      state.po[point.id] = {
        c: point.coords
      }
    });

    game.players.forEach(function ( player ) {
      let playerState = {};
      if (!player.alive) {
        playerState.d = true;
      } else {
        playerState.b = player.body;
      }
      state.pl[player.id] = playerState;
    });

    return state;
  }

  ditchTheDead () {
    const game = this;
    game.players = game.players.filter(function ( player ) {
      return player.alive;
    });
  }

  init ( server ) {
    const game = this;
    if (server) {
      game.addPoint();
      _tickHandler();
    }
  }
}
