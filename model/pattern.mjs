import BasicInstrument from './instrument.mjs'

export default class Pattern {
  constructor(audio, trackId, waveId, sectionId) {
    this.id = Pattern.Key(trackId, waveId, sectionId)
    this.audio = audio
    this.instrument = new BasicInstrument(audio)
    this.sequence = []
    for (let i=0; i<16; i++) this.sequence.push([])
  }

  select() {
    this.audio.select(this)
  }

  toggle(beat, note) {
    const timestep = this.sequence[beat]
    const index = timestep.indexOf(note.key)
    if (index > -1) timestep.splice(index, 1)
    else timestep.push(note.key) 
  }

  isSet(beat, note) {
    return this.sequence[beat].includes(note.key)
  }

  static Key(trackId, waveId, signalId) {
    return `${trackId}${signalId}${waveId}`
  }
}