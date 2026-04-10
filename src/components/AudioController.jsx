import { useState, useEffect, useRef } from 'react'
import { getAudioContext } from '../utils/sounds'

export default function AudioController() {
  const [isPlaying, setIsPlaying] = useState(true)
  const oscRef = useRef(null)
  const gainRef = useRef(null)

  // Auto-start ambient hum using the shared AudioContext (already unlocked from "Enter" click)
  useEffect(() => {
    const ctx = getAudioContext()
    if (!ctx) return

    // Start the ambient hum immediately
    oscRef.current = ctx.createOscillator()
    gainRef.current = ctx.createGain()

    oscRef.current.type = 'sine'
    oscRef.current.frequency.setValueAtTime(55, ctx.currentTime)

    gainRef.current.gain.setValueAtTime(0, ctx.currentTime)
    gainRef.current.gain.setTargetAtTime(0.3, ctx.currentTime, 1)

    oscRef.current.connect(gainRef.current)
    gainRef.current.connect(ctx.destination)
    oscRef.current.start()

    return () => {
      if (oscRef.current) {
        try { oscRef.current.stop() } catch {}
      }
    }
  }, [])

  const toggleSound = () => {
    const ctx = getAudioContext()
    if (!ctx || !gainRef.current) return

    if (isPlaying) {
      gainRef.current.gain.setTargetAtTime(0, ctx.currentTime, 0.5)
      setIsPlaying(false)
    } else {
      if (ctx.state === 'suspended') ctx.resume()
      gainRef.current.gain.setTargetAtTime(0.3, ctx.currentTime, 1)
      setIsPlaying(true)
    }
  }

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '1.5rem',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem',
          background: 'rgba(5, 5, 5, 0.4)',
          border: '1px solid rgba(236,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '50px',
          cursor: 'pointer',
          fontFamily: 'var(--font-heading)',
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          color: 'var(--color-primary)'
        }}
        onClick={toggleSound}
      >
        <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '15px' }}>
          <div style={{ width: '2px', height: isPlaying ? '100%' : '20%', background: 'var(--color-secondary)', transition: 'height 0.2s', animation: isPlaying ? 'bounce 0.8s infinite alternate' : 'none' }}></div>
          <div style={{ width: '2px', height: isPlaying ? '60%' : '20%', background: 'var(--color-secondary)', transition: 'height 0.2s', animation: isPlaying ? 'bounce 0.5s infinite alternate' : 'none' }}></div>
          <div style={{ width: '2px', height: isPlaying ? '80%' : '20%', background: 'var(--color-secondary)', transition: 'height 0.2s', animation: isPlaying ? 'bounce 0.6s infinite alternate' : 'none' }}></div>
          <div style={{ width: '2px', height: isPlaying ? '40%' : '20%', background: 'var(--color-secondary)', transition: 'height 0.2s', animation: isPlaying ? 'bounce 0.4s infinite alternate' : 'none' }}></div>
        </div>
        
        {isPlaying ? 'Sound [ON]' : 'Sound [OFF]'}
      </div>

      <style>{`
        @keyframes bounce {
          0% { transform: scaleY(0.3); transform-origin: bottom; }
          100% { transform: scaleY(1); transform-origin: bottom; }
        }
      `}</style>
    </>
  )
}
