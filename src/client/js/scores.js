'use strict';
const Pixel = require('./pixel.js');

module.exports = class Scores {
  constructor ( client ) {
    let scores = [];
    let colorPicker = new Pixel(0,0,0,0,[0,0]);
    const scoreBoard = document
      .getElementById('scores')
      .getElementsByTagName('table')[0];

    const header = `<tr>
                      <th>#</th>
                      <th>NAME</th>
                      <th>SCORE</th>
                      <th>PING</th>
                    </tr>`;

    let boardInner = ``;

    client.on('update', function ( recievedScores ) {
      if (!recievedScores) return [];

      scores =  recievedScores.sort(function ( s0, s1 ) {
        return s0.so > s1.so ? -1 : s0.so == s1.so ? 0 : 1;
      }).map(function ( score, index ) {
        return {
          place: (score.da) ? index + 1 : 'X',
          score: score.so,
          name: score.nm,
          color: colorPicker.setColor(score.cl).hex,
          ping: score.pn
        };
      });

      let tempInner = header;

      for (let score of scores) {
        tempInner += `<tr>
                        <td>${score.place}</td>
                        <td style="color: ${score.color};">${score.name}</td>
                        <td>${score.score}</td>
                        <td>${score.ping}ms</td>
                      </tr>`
      }

      if (tempInner !== boardInner) {
        scoreBoard.innerHTML = boardInner = tempInner;
      }
    });

  }
};
