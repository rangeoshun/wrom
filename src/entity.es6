class Entity {
  constructor ( x, y ) {
    const entity = this;
    entity.coords = [x, y];
    entity.id = (new Date().getTime()+Math.floor(Math.random()*1000)).toString(16);
    entity.alive = false;

    _callbacks.push(this.render());
  }

  die () {
    const entity = this;
    entity.alive = false;
  }

  random ( dimension ) {
    return Math.floor(Math.random() * _resolution[dimension]);
  }

  relocate () {
    const entity = this;
    entity.coords = [entity.random(0), entity.random(1)];
  }

  render () {
    const entity = this;
    return function ( pixel ) {

      if (pixel.x() == entity.coords[0] && pixel.y() == entity.coords[1]) {
        pixel[1] = pixel[2] = pixel[3] =
          '0.'+ (new Date().getTime() / 1000).toString().split('.')[1];
      }

      return entity.alive;
    };
  }
}
