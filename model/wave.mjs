import Pattern from './pattern.mjs'

export default class Wave {
  constructor(audio, trackId, waveId, waveSections) {
    this.patterns = []
    for (let section of waveSections) {
      this.patterns.push(new Pattern(audio, trackId, waveId, section))
    }
  }

}