import Track from './track.mjs'

export default class AudioPipeline {
  constructor() {
    this.ctxCallbacks = []
    this.selectedPattern = null

    // create tracks
    const waveSections = ['L', 'H']
    this.tracks = []
    for (let trackId=1; trackId<=4; trackId++) {
      const numWaves = Math.pow(2, trackId-1)
      this.tracks.push(new Track(this, trackId, numWaves, waveSections))
    }

    document.addEventListener('click', () => {
      if (this.ctx) return
      this.ctx = new AudioContext();
      this.ctxCallbacks.forEach((callback) => callback(this.ctx))
    })
  }

  registerPattern(pattern) {
    this.sequences.push(pattern)
  }

  onContextReady(callback) {
    this.ctxCallbacks.push(callback)
  }

  select(pattern) {
    this.selectedPattern = pattern
  }
}