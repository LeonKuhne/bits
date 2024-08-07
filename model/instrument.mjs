export default class BasicInstrument {
  constructor(audio, adsr={}) {
    this.adsr = {attack: 0.3, release: 0.5, slide: 0.3, ...adsr}
    this.isPlaying = false
    this.ctx = null
    audio.onContextReady((ctx) => {
      this.ctx = ctx
      this.volume = new GainNode(this.ctx, { gain: 0 })
      this.volume.connect(this.ctx.destination)
    })
  }

  play(freq) {
    this._instance()
    this.osc.frequency.setValueAtTime(freq, this.ctx.currentTime)
    this._start()
  }

  slide(freq) {
    if (!this.isPlaying) return
    this.osc.frequency.setValueAtTime(freq, this.ctx.currentTime + this.adsr.slide)
  }

  stop() {
    if (!this.isPlaying) return
    this.isPlaying = false
    this.volume.gain.setTargetAtTime(0, this.ctx.currentTime, this.adsr.release)
    setTimeout(() => {
      if (!this.osc) return
      this.osc.disconnect()
      this.osc.stop()
      this.osc = null
    }, this.adsr.release * 1000)
  }

  _instance() {
    if (this.osc) return
    this.volume.gain.setValueAtTime(0, this.ctx.currentTime)
    this.osc = new OscillatorNode(this.ctx, { type: "sine" })
    this.osc.connect(this.volume)
    this.osc.start()
  }

  _start() {
    if (this.isPlaying) return
    this.isPlaying = true
    this.volume.gain.exponentialRampToValueAtTime(1, this.ctx.currentTime + this.adsr.attack)
  }
}