class Pixel extends Array {
  constructor ( drawn, r, g, b, coords ) {
    super(drawn || 0, r || 0, g || 0, b || 0, coords);
    const pixel = this;

    pixel.r = function () {
      let component = this[1];
      if (!component) return component.toString();
      else return Math.round(component*255).toString(16) || '0';
    };
    pixel.g = function() {
      let component = this[2];
      if (!component) return component.toString();
      else return Math.round(component*255).toString(16) || '0';
    }
    pixel.b = function() {
      let component = this[3];
      if (!component) return component.toString();
      else return Math.round(component*255).toString(16);
    }

    pixel.x = function () {
       return this[4][0];
    }

    pixel.y = function () {
       return this[4][1];
    }

    pixel.getHex = function () {
      let r = this.r();
      if (r.length === 1) r = '0' + r;
      let g = this.g();
      if (g.length === 1) g = '0' + g;
      let b = this.b();
      if (b.length === 1) b = '0' + b;

      return '#'+ r + b + g;
    }

    pixel.isEmpty = function ( pixel ) {
      return !this[0];
    }
  }
}
