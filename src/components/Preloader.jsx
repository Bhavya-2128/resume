import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Preloader({ onEnterComplete }) {
  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [buttonPos, setButtonPos] = useState({ x: 0, y: 0 })
  const buttonRef = useRef(null)

  // Simulation of loading progress
  useEffect(() => {
    let current = 0
    const interval = setInterval(() => {
      // Simulate variable loading speeds like real site
      const increment = Math.random() > 0.5 ? 5 : 2
      current += increment
      if (current >= 100) {
        current = 100
        clearInterval(interval)
        setTimeout(() => setIsLoaded(true), 800)
      }
      setProgress(current)
    }, 40)

    return () => clearInterval(interval)
  }, [])

  // Magnetic button logic
  const handleMouseMove = (e) => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    // Calculate distance from center of the button wrapper
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    // Create subtle magnetic pull
    const distanceX = (e.clientX - centerX) * 0.2
    const distanceY = (e.clientY - centerY) * 0.2

    setButtonPos({ x: distanceX, y: distanceY })
  }

  const handleMouseLeave = () => {
    setButtonPos({ x: 0, y: 0 })
  }

  return (
    <AnimatePresence>
      <motion.div
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }} // Smooth cinematic exit
        style={{
          position: 'fixed',
          inset: 0,
          background: '#011317', // The exact QuantumStretch deep dark background
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#d3b166',
          fontFamily: 'var(--font-heading)'
        }}
      >
        <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Circular SVG Loader */}
          <AnimatePresence>
            {!isLoaded && (
              <motion.svg
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                viewBox="0 0 100 100"
                style={{ position: 'absolute', width: '100%', height: '100%' }}
              >
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="#d3b166"
                  strokeWidth="1"
                  strokeDasharray="301.59" // 2 * pi * r
                  strokeDashoffset={301.59 - (301.59 * progress) / 100}
                  style={{ transition: 'stroke-dashoffset 0.1s linear', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                />
              </motion.svg>
            )}
          </AnimatePresence>

          {/* Number 0-100% or "Enter" Button */}
          {!isLoaded ? (
            <motion.div exit={{ opacity: 0 }} style={{ fontSize: '1.5rem', fontWeight: 300, letterSpacing: '2px' }}>
              {Math.floor(progress)}%
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              ref={buttonRef}
            >
              <motion.button
                onClick={onEnterComplete}
                animate={{ x: buttonPos.x, y: buttonPos.y }}
                transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.5 }}
                style={{
                  background: 'transparent',
                  border: '1px solid #d3b166',
                  color: '#d3b166',
                  borderRadius: '50%',
                  width: '120px',
                  height: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '4px',
                  fontFamily: 'var(--font-heading)'
                }}
              >
                Enter
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Text underneath */}
        <AnimatePresence>
          {!isLoaded && (
            <motion.div 
              exit={{ opacity: 0, y: 20 }}
              style={{ 
                position: 'absolute', 
                bottom: '20%', 
                textTransform: 'uppercase', 
                letterSpacing: '5px',
                fontSize: '0.8rem',
                color: '#ECFFFF'
              }}
            >
              Wrapping Quantum
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
