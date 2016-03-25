class Game {
  constructor () {
    const game = this;
    game.points = [];
    game.players = [];
    game.paused = false;
    game.previousState = {};
  }

  togglePause () {
    const game = this;
    game.paused = !game.paused;
  }

  getRandomPoint () {
    const factor = Math.round(Math.random() * 10);
    if (factor > 9) {
      return GoldenPoint;
    } else {
      return Point;
    }
  }

  addPoint ( id, type ) {
    const game = this;
    const Type = type || game.getRandomPoint();
    let point = new Type();
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

  getState ( fullState ) {
    const game = this;
    let state = {};

    game.points.forEach(function ( point ) {
      if (!fullState && point.updated === false) return;
      if (!state.hasOwnProperty('po')) state.po = {};
      let pointState = {};

      if (point.alive) {
        pointState.t = point.type;
        pointState.c = point.coords;
      } else {
        pointState.d = true;
      }

      state.po[point.id] = pointState;
      point.updated = false;
    });

    game.players.forEach(function ( player ) {
      if (!fullState && player.updated === false) return;
      if (!state.hasOwnProperty('pl')) state.pl = {};
      let playerState = {};

      if (player.alive) {
        playerState.b = player.body;
        if (player.ghost) playerState.g = player.ghost;
      } else {
        playerState.d = true;
      }

      state.pl[player.id] = playerState;
      player.updated = false;
    });

    return state;
  }

  ditchTheDead () {
    const game = this;

    game.points = game.points.filter(function ( point ) {
      return point.alive;
    });
    game.players = game.players.filter(function ( player ) {
      return player.alive;
    });
  }

  init ( server ) {
    const game = this;
    if (server) {
      game.server = true;
      _tickHandler();
    }
  }
}
