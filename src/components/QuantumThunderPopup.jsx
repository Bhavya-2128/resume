import { motion } from 'framer-motion'
import { useEffect } from 'react'

export default function QuantumThunderPopup({ onComplete }) {
  useEffect(() => {
    // Automatically dismiss the popup after full cinematic sequence
    const timer = setTimeout(onComplete, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      zIndex: 9999, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden'
    }}>
      
      {/* Flashing Thunder Overlay */}
      <motion.div
        animate={{ backgroundColor: ['rgba(0,0,0,0)', 'rgba(236, 255, 255, 0.4)', 'rgba(0,0,0,0.9)', 'rgba(236, 255, 255, 0.8)', 'rgba(0,0,0,0.85)'] }}
        transition={{ duration: 0.8, times: [0, 0.05, 0.1, 0.2, 1] }}
        style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0 }}
      />

      {/* Realistic Lightning Bolts via SVG Paths */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
        <defs>
          <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-magenta" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Bolt 1 */}
        <motion.path
          d="M 30,0 L 45,20 L 25,45 L 60,60 L 40,80 L 50,100"
          stroke="#ffffff"
          strokeWidth="0.5"
          fill="none"
          filter="url(#glow-cyan)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0, 1, 0, 0] }}
          transition={{ duration: 0.6, times: [0, 0.1, 0.2, 0.3, 0.5, 1] }}
          vectorEffect="non-scaling-stroke"
        />
        <motion.path
          d="M 30,0 L 45,20 L 25,45 L 60,60 L 40,80 L 50,100"
          stroke="#ecffff"
          strokeWidth="2"
          fill="none"
          filter="url(#glow-cyan)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0, 1, 0, 0] }}
          transition={{ duration: 0.6, times: [0, 0.1, 0.2, 0.3, 0.5, 1] }}
          vectorEffect="non-scaling-stroke"
        />

        {/* Bolt 2 */}
        <motion.path
          d="M 80,0 L 60,25 L 85,50 L 50,70 L 65,100"
          stroke="#d3b166"
          strokeWidth="1.5"
          fill="none"
          filter="url(#glow-magenta)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0, 1, 0, 0] }}
          transition={{ duration: 0.8, delay: 0.3, times: [0, 0.1, 0.2, 0.3, 0.6, 1] }}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Massive Quantum Energy Orb Implosion -> Explosion */}
      <motion.div
        initial={{ scale: 20, opacity: 0 }}
        animate={{ 
          scale: [20, 0.1, 3, 0], 
          opacity: [0, 1, 1, 0],
        }}
        transition={{ 
          duration: 1.5, 
          times: [0, 0.3, 0.5, 1], 
          ease: "easeInOut" 
        }}
        style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #ffffff 10%, #d3b166 40%, rgba(211, 177, 102, 0) 80%)',
          boxShadow: '0 0 100px #d3b166, 0 0 200px #ecffff',
          zIndex: 2,
          mixBlendMode: 'screen',
        }}
      />

      {/* Expansion Shockwaves */}
      <motion.div
        initial={{ scale: 0, opacity: 1, borderWidth: '50px' }}
        animate={{ scale: 15, opacity: 0, borderWidth: '0px' }}
        transition={{ duration: 1.2, delay: 0.3, ease: "circOut" }}
        style={{
          position: 'absolute',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          borderColor: '#ecffff',
          borderStyle: 'solid',
          zIndex: 2,
          boxShadow: '0 0 50px #ecffff'
        }}
      />

      <motion.div
        initial={{ scale: 0, opacity: 1, borderWidth: '30px' }}
        animate={{ scale: 20, opacity: 0, borderWidth: '0px' }}
        transition={{ duration: 1.8, delay: 0.4, ease: "circOut" }}
        style={{
          position: 'absolute',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          borderColor: '#d3b166',
          borderStyle: 'solid',
          zIndex: 2,
          boxShadow: '0 0 100px #d3b166'
        }}
      />

      {/* Final God Tier Message Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1, type: 'spring', bounce: 0.5 }}
        style={{
          zIndex: 10,
          textAlign: 'center',
          background: 'var(--color-bg-secondary)',
          padding: '3rem 5rem',
          borderRadius: '2px', // Sharper corners for Lightmorphism
          border: '1px solid rgba(236, 255, 255, 0.1)',
          borderTop: '2px solid #ecffff',
          borderBottom: '2px solid #d3b166',
          boxShadow: '0 0 80px rgba(211, 177, 102, 0.2)',
          backdropFilter: 'blur(15px)'
        }}
      >
        <motion.h2 
          animate={{ textShadow: ['0 0 10px #ecffff', '0 0 30px #ecffff', '0 0 10px #ecffff'] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            color: '#ecffff',
            fontFamily: 'var(--font-heading)',
            fontSize: '3.5rem',
            textTransform: 'uppercase',
            letterSpacing: '8px',
            margin: 0
          }}
        >
          Transmitted
        </motion.h2>
        <p style={{
          color: '#d3b166',
          fontFamily: 'var(--font-heading)',
          fontSize: '1.2rem',
          letterSpacing: '3px',
          textShadow: '0 0 10px rgba(211, 177, 102, 0.3)',
          marginTop: '1.5rem',
          textTransform: 'uppercase'
        }}>
          Quantum Entanglement Achieved.
        </p>
      </motion.div>
    </div>
  )
}
