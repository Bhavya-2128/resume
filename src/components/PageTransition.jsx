import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function PageTransition({ isTransitioning, onComplete, onFinished, targetPage }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (!isTransitioning) {
      setPhase(0)
      return
    }

    setPhase(1)

    const holdTimer = setTimeout(() => {
      setPhase(2)
      if (onComplete) onComplete()
    }, 800)

    const revealTimer = setTimeout(() => {
      setPhase(3)
    }, 1200)

    const doneTimer = setTimeout(() => {
      setPhase(0)
      if (onFinished) onFinished()
    }, 2200)

    return () => {
      clearTimeout(holdTimer)
      clearTimeout(revealTimer)
      clearTimeout(doneTimer)
    }
  }, [isTransitioning])

  if (phase === 0) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9998,
      pointerEvents: isTransitioning ? 'all' : 'none',
      overflow: 'hidden',
    }}>
      {/* Main curtain */}
      <motion.div
        initial={{ y: '100%' }}
        animate={
          phase === 1 ? { y: '0%' } :
          phase === 2 ? { y: '0%' } :
          phase === 3 ? { y: '-100%' } :
          { y: '100%' }
        }
        transition={{ duration: phase === 1 ? 0.7 : 0.8, ease: [0.76, 0, 0.24, 1] }}
        style={{ position: 'absolute', inset: 0, background: '#011317', zIndex: 1 }}
      />

      {/* Secondary curtain */}
      <motion.div
        initial={{ y: '100%' }}
        animate={
          phase === 1 ? { y: '0%' } :
          phase === 2 ? { y: '0%' } :
          phase === 3 ? { y: '-100%' } :
          { y: '100%' }
        }
        transition={{ duration: phase === 1 ? 0.7 : 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.08 }}
        style={{ position: 'absolute', inset: 0, background: '#0a1f24', zIndex: 0 }}
      />

      {/* Gold accent line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={
          phase >= 1 && phase <= 2 ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }
        }
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: phase === 1 ? 0.3 : 0 }}
        style={{
          position: 'absolute', top: '50%', left: 0, right: 0,
          height: '1px', background: 'linear-gradient(90deg, transparent, #d3b166, transparent)',
          transformOrigin: 'left center', zIndex: 3,
        }}
      />

      {/* Page label */}
      <AnimatePresence>
        {(phase === 1 || phase === 2) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)', zIndex: 4,
              fontFamily: 'var(--font-heading)', fontSize: '0.75rem',
              textTransform: 'uppercase', letterSpacing: '8px',
              color: '#d3b166', whiteSpace: 'nowrap',
            }}
          >
            {targetPage || 'Loading'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corner dots */}
      {(phase === 1 || phase === 2) && (
        <>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, duration: 0.3 }}
            style={{ position: 'absolute', top: '2rem', left: '2rem', width: 6, height: 6, borderRadius: '50%', background: '#d3b166', zIndex: 4 }} />
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.55, duration: 0.3 }}
            style={{ position: 'absolute', top: '2rem', right: '2rem', width: 6, height: 6, borderRadius: '50%', background: '#d3b166', zIndex: 4 }} />
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, duration: 0.3 }}
            style={{ position: 'absolute', bottom: '2rem', left: '2rem', width: 6, height: 6, borderRadius: '50%', background: '#d3b166', zIndex: 4 }} />
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.65, duration: 0.3 }}
            style={{ position: 'absolute', bottom: '2rem', right: '2rem', width: 6, height: 6, borderRadius: '50%', background: '#d3b166', zIndex: 4 }} />
        </>
      )}

      {/* Expanding ring */}
      {phase === 2 && (
        <motion.div
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 8, opacity: 0 }}
          transition={{ duration: 1.2, ease: 'circOut' }}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 100, height: 100, marginTop: -50, marginLeft: -50,
            borderRadius: '50%', border: '1px solid #d3b166', zIndex: 3,
          }}
        />
      )}
    </div>
  )
}
