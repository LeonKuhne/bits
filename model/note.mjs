export default class Note {
  static semitoneStep = Math.pow(2, 1/12)
  static names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
  static noteFreqs = Note.names.map((_, i) => 440 * Math.pow(Note.semitoneStep, i - 9))

  constructor(octave, name, onToggle) {
    const note = Note.names.indexOf(name)
    this.freq = Note.noteFreqs[note] * Math.pow(2, octave)
    this.key = `${name}${octave}`
    this.toggle = (timestep) => onToggle(timestep, this)
  }

  _freqToNote(freq) { return Math.round(12 * Math.log2(freq / 440) + 9) }
  _freqToNoteName(freq) { return noteNames[freqToNote(freq) % 12] }
  _freqToOctave(freq){ return Math.floor(freqToNote(freq) / 12) - 1 }
}