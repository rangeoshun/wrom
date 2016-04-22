module.exports = class Sounds {
  constructor ( client ) {
    const sounds = this;
    const effectsPlayer = document.createElement('audio');
    const soundNames = [
      'sin1',
      'sin2',
      'sin3',
      'sin4',
      'sin5',
      'sin6',
      'sin7',
      'sin8',
      'wormcrash'
    ];

    const soundPool = soundNames.map(function ( sound, index ) {
      let audio = new Audio(`./assets/sounds/${sound}.mp3`);
      audio.volume = 0.2
      return audio; 
    });

    let currentSound;
    sounds.play = function ( soundID ) {
      currentSound = soundPool[soundID];
      currentSound.pause();
      currentSound.currentTime = 0;
      currentSound.play();
    };
  }
}
