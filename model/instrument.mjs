export default class BasicInstrument {
  constructor(audio, adsr={}) {
    this.adsr = {attack: .3, release: .5, slide: .3, ...adsr}
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
    this._start()
    this.osc.frequency.setValueAtTime(freq, this.ctx.currentTime)
  }

  note(freq) {
    if (!this.isPlaying) return
    this.osc.frequency.setValueAtTime(freq, this.ctx.currentTime + this.adsr.slide)
  }

  stop() {
    if (!this.isPlaying) return
    console.log('stopping')
    this.volume.gain.linearRampToValueAtTime(0, this.ctx.currentTime + this.adsr.release)
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
    this.osc.start()
    this.volume.gain.linearRampToValueAtTime(1, this.ctx.currentTime + this.adsr.attack)
    this.isPlaying = true
  }

}