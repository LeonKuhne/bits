import Wave from './wave.mjs'

export default class Track {
  constructor(audio, trackId, numWaves, waveSections) {
    this.id = trackId
    this.waves = []
    for (let waveId=1; waveId<=numWaves; waveId++) {
      this.waves.push(new Wave(audio, trackId, waveId, waveSections))
    }
  }
}