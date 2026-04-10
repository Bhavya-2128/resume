// Shared AudioContext — must be created during a user gesture (e.g. "Enter" click)
let sharedAudioCtx = null

export function initAudioContext() {
  const AudioContext = window.AudioContext || window.webkitAudioContext
  if (!AudioContext) return null
  
  sharedAudioCtx = new AudioContext()
  
  // Resume immediately (we're inside a click handler so this is allowed)
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume()
  }
  
  return sharedAudioCtx
}

export function getAudioContext() {
  return sharedAudioCtx
}

export function playTransitionSound() {
  // Use shared context if available, otherwise create a new one
  let ctx = sharedAudioCtx
  if (!ctx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    ctx = new AudioContext()
  }
  
  if (ctx.state === 'suspended') {
    ctx.resume()
  }

  // Create noise burst (whoosh)
  const bufferSize = ctx.sampleRate * 2.0
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }

  const noise = ctx.createBufferSource()
  noise.buffer = buffer

  const noiseFilter = ctx.createBiquadFilter()
  noiseFilter.type = 'lowpass'
  noiseFilter.frequency.setValueAtTime(200, ctx.currentTime)
  noiseFilter.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.3)
  noiseFilter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 1.2)

  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(0, ctx.currentTime)
  noiseGain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.3)
  noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2)

  noise.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(ctx.destination)

  noise.start()

  // Create deep sub impact
  const osc = ctx.createOscillator()
  const subGain = ctx.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(120, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.5)

  subGain.gain.setValueAtTime(0, ctx.currentTime)
  subGain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.1)
  subGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5)

  osc.connect(subGain)
  subGain.connect(ctx.destination)

  osc.start()
  osc.stop(ctx.currentTime + 2)
}
