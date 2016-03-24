class Entity {
  constructor ( x, y ) {
    const entity = this;

    entity.coords = [x, y];
    entity.id = (new Date().getTime()+Math.floor(Math.random()*1000)).toString(16);
    entity.alive = false;

    _callbacks.push(this.render());
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

  displace ( coords, by = 2 ) {
    let x = Math.round(Math.random() * by + 1) - 1;
    let y = Math.round(Math.random() * by + 1) - 1;
    return [coords[0] + x, coords[1] + y];
  }

  relocate () {
    const entity = this;
    entity.coords = [entity.random(0), entity.random(1)];
  }

  render () {
    const entity = this;
    return function ( pixel ) {

      if (pixel[4][0] == entity.coords[0] && pixel[4][1] == entity.coords[1]) {
        pixel[1] = pixel[2] = pixel[3] =
          Math.sin(parseFloat('0.'+ (new Date().getTime() / 1000).toString().split('.')[1]) * Math.PI);
      }

      return entity.alive;
    };
  }
}
