import BasicInstrument from './instrument.mjs'

export default class Pattern {
  constructor(audio, trackId, waveId, sectionId) {
    this.id = Pattern.Key(trackId, waveId, sectionId)
    this.instrument = new BasicInstrument(audio)
  }

  static Key(trackId, waveId, signalId) {
    return `${trackId}${signalId}${waveId}`
  }
}