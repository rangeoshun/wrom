class GoldenPoint extends Point {
  constructor (x, y) {
    super(x, y);
    const point = this;
    point.relocate();
    point.alive = true;
    point.value = 50;
    point.color = [1,0.8,0];
    point.type = 'gp';

    _tickCallbacks.push(point.isColliding());
  }
}
