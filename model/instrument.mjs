export default class BasicInstrument {
  constructor(audio, adsr={}) {
    this.adsr = {attack: 0.3, release: 0.3, slide: 0.3, ...adsr}
    this.isPlaying = false
    this.ctx = null
    audio.onContextReady((ctx) => {
      this.ctx = ctx
    })
  }

  _instance(freq) {
    if (this.osc) return
    const now = this.ctx.currentTime
    const timeAtFullVolume = now + this.adsr.attack 
    this.osc = this.ctx.createOscillator()
    this.volume = this.ctx.createGain()
    this.osc.connect(this.volume)
    this.volume.connect(this.ctx.destination)
    this.osc.frequency.value = freq
    this.volume.gain.setValueAtTime(0, now)
    this.volume.gain.linearRampToValueAtTime(1, timeAtFullVolume)
    this.volume.gain.setValueAtTime(1, timeAtFullVolume)
    this.osc.start()
  }

  play(freq) {
    this._instance(freq)
    this.isPlaying = true
  }

  slide(freq) {
    if (!this.isPlaying) return
    this.osc.frequency.setValueAtTime(freq, this.ctx.currentTime + this.adsr.slide)
  }

  stop() {
    if (!this.isPlaying) return
    const time = this.ctx.currentTime
    const delay = this.adsr.release
    const eol = time + delay
    this.isPlaying = false
    // ramp back down from attack
    if (this.volume.gain.value !== 1) {
      this.volume.gain.linearRampToValueAtTime(0, eol)
    // ramp down from max
    } else {
      const halflife = time + delay/2
      this.volume.gain.setValueAtTime(1, time)
      this.volume.gain.exponentialRampToValueAtTime(0.5, halflife)
      this.volume.gain.setValueAtTime(0.5, halflife)
      this.volume.gain.exponentialRampToValueAtTime(0.001, eol)
    }
    this.volume.gain.setValueAtTime(0, eol)
    setTimeout(() => {
      if (!this.osc) return
      this.osc.disconnect()
      this.osc.stop()
      this.osc = null
    }, delay * 1000)
  }
}