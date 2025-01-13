/* var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playNote(frequency, duration) {
  // create Oscillator node
  let oscillator = audioCtx.createOscillator();

  oscillator.type = "square";
  oscillator.frequency.value = frequency; // value in hertz
  oscillator.connect(audioCtx.destination);
  oscillator.start();

  setTimeout(function () {
    oscillator.stop();
    playMelody();
  }, duration);
}

function playMelody() {
  if (notes.length > 0) {
    let note = notes.pop(),
      tempo = 100;
    playNote(note[0], (1000 * 256) / (note[1] * tempo));
  }
}

let notes = [
  [659, 4],
  [659, 4],
  [659, 4],
  [523, 8],
  [0, 16],
  [783, 16],
  [659, 4],
  [523, 8],
  [0, 16],
  [783, 16],
  [659, 4],
  [0, 4],
  [987, 4],
  [987, 4],
  [987, 4],
  [1046, 8],
  [0, 16],
  [783, 16],
  [622, 4],
  [523, 8],
  [0, 16],
  [783, 16],
  [659, 4],
];

notes.reverse();

playMelody();
 */



    // create web audio api context
    /*  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // create Oscillator node
    const oscillator = audioCtx.createOscillator();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime); // value in hertz
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    this.sleep(2000);
    oscillator.stop();
 */

