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

  note(freq) {
    if (!this.isPlaying) return
    this.osc.frequency.setValueAtTime(freq, this.ctx.currentTime + this.adsr.slide)
  }

  stop() {
    if (!this.isPlaying) return
    console.log('stopping')
    this.volume.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + this.adsr.release)
    this.isPlaying = false
    //this.osc.stop(this.ctx.currentTime + this.adsr.release)
  }

  _instance() {
    if (this.isPlaying) return
    if (this.osc) {
      this.osc.disconnect()
      this.osc.stop()
    }
    this.osc = new OscillatorNode(this.ctx, { type: "sine" })
    this.osc.connect(this.volume)
  }

  _start() {
    if (this.isPlaying) return
    console.log('starting')
    this.isPlaying = true
    this.volume.gain.exponentialRampToValueAtTime(1, this.ctx.currentTime + this.adsr.attack)
    this.osc.start()
  }

}