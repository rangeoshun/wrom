class Pixel extends Array {
  constructor ( drawn, r, g, b, coords ) {
    super(drawn || 0, r || 0, g || 0, b || 0, coords);
    const pixel = this;

    pixel.r = function () {
      let component = this[1];

      if (!component) return 0;
      else return Math.round(component*255);
    };

    pixel.g = function() {
      let component = this[2];

      if (!component) return 0;
      else return Math.round(component*255);
    };

    pixel.b = function() {
      let component = this[3];

      if (!component) return 0;
      else return Math.round(component*255);
    };

    pixel.getHex = function () {
      let r = this.r().toString(16);
      let g = this.g().toString(16);
      let b = this.b().toString(16);

      if (r.length === 1) r = '0' + r;
      if (g.length === 1) g = '0' + g;
      if (b.length === 1) b = '0' + b;

      return '#'+ r + g + b;
    }

    pixel.isEmpty = function ( pixel ) {
      return !this[0];
    }
  }
}
