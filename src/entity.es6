class Entity {
  constructor ( x, y ) {
    const entity = this;

    entity.coords = [x, y];
    entity.id = (new Date().getTime()+Math.floor(Math.random()*1000)).toString(16);
    entity.alive = true;

    if (!_game.server) {
      _renderCallbacks.push(entity.render());
    }
    console.log(`${entity.constructor.name} ${entity.id} is alive`);
  }

  die () {
    const entity = this;
    entity.alive = false;
    console.log(`${entity.constructor.name} ${entity.id} is dead`);
  }

  random ( dimension ) {
    return Math.floor(Math.random() * _resolution[dimension]);
  }

  isCoordOutOfBOunds ( coord ) {
    if (coord[0] >= _resolution[0]
      || coord[0] < 0
      || coord[1] >= _resolution[1]
      || coord[1] < 0) {

      return true;
    }
    return false;
  }

  displace ( coord, by = 2 ) {
    const entity = this;
    let x = Math.round(Math.random() * by + 1) - 1;
    let y = Math.round(Math.random() * by + 1) - 1;
    let newCoord = [coord[0] + x, coord[1] + y];

    if (entity.isCoordOutOfBOunds(newCoord)) {
      newCoord[0] *= -1;
      newCoord[1] *= -1;
    }

    return newCoord;
  }

  relocate () {
    const entity = this;
    entity.coords = [entity.random(0), entity.random(1)];
  }

  render () {
    const entity = this;
    return function () {
      let pixels = [];
      let r = Math.sin(parseFloat('0.'+ (new Date().getTime() / 1000).toString().split('.')[1]) * Math.PI);
      let g = r;
      let b = r;

      pixels.die = !entity.alive;
      pixels.push(new Pixel(1, r, g, b, entity.coords));

      return pixels;
    };
  }
}
