'use strict';
/*
module.exports = class Matrix {

  constructor ( x, y ) {
    const matrix = this;
    let rows = [];
    for (let i = 0; i < y; i++) {
      let row = [];
      for (let e = 0; e < x; e++) {
        row.push(null);
      }
      rows.push(row);
    }

    matrix.get = function get ( coord ) {
      return rows[y][x];
    };

    matrix.set = function set ( pixel ) {
      return rows[y][x] = pixel;
    };

    matrix.getBounds = function ( coords0, coords1 ) {
      let bounds = [];
      const startX = coords0[0];
      const endX = coords0[0];
      const startY = coords1[0];
      const endY = coords1[1];

      for (let y = startY; y < endY; y++) {
        let pixels = [];
        for (let x = startX; x < endX; x++) {
          pixels.push(rows[y][x]);
        }
      }

      return pixels;
    };
  }
}
*/
