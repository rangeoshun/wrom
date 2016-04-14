module.exports = class AllTime {
  constructor ( client ) {
    let scores = [];
    const scoreBoard = document
      .getElementById('allTime')
      .getElementsByTagName('table')[0];

    const header = `<tr>
                      <th>#</th>
                      <th>NAME</th>
                      <th>SCORE</th>
                    </tr>`;

    let boardInner = ``;

    client.on('allTimeUpdate', function ( recievedScores ) {
      if (!recievedScores) return [];

      scores =  recievedScores.sort(function ( s0, s1 ) {
        return s0.so > s1.so ? -1 : s0.so == s1.so ? 0 : 1;
      }).map(function ( score, index ) {
        return {
          place: score.pa,
          score: score.so,
          name: score.nm,
        };
      });

      let tempInner = header;

      for (let score of scores) {
        tempInner += `<tr>
                        <td>${score.place}</td>
                        <td class="color: ${score.color};">${score.name}</td>
                        <td>${score.score}</td>
                      </tr>`
      }

      if (tempInner !== boardInner) {
        scoreBoard.innerHTML = boardInner = tempInner;
      }
    });
  }
};
