import React, { useState, useCallback, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import QuantumBackground from './components/QuantumBackground'
import Navbar from './components/Navbar'
import Preloader from './components/Preloader'
import AudioController from './components/AudioController'
import PageTransition from './components/PageTransition'
import { playTransitionSound, initAudioContext } from './utils/sounds'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Resume from './sections/Resume'
import Contact from './sections/Contact'

function App() {
  const [hasEntered, setHasEntered] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [targetLabel, setTargetLabel] = useState('')
  const pendingScrollId = useRef(null)

  // Navigate with cinematic transition then scroll to section
  const navigateToSection = useCallback((sectionId, label) => {
    pendingScrollId.current = sectionId
    setTargetLabel(label || sectionId)
    setIsTransitioning(true)
    playTransitionSound()
  }, [])

  // Called mid-transition when the curtain fully covers the screen
  const handleTransitionMidpoint = useCallback(() => {
    if (pendingScrollId.current) {
      const el = document.getElementById(pendingScrollId.current)
      if (el) {
        el.scrollIntoView({ behavior: 'instant' })
      }
      pendingScrollId.current = null
    }
  }, [])

  // HUD border
  const siteBorderHUD = (
    <div style={{
      position: 'fixed',
      top: '1rem', left: '1rem', right: '1rem', bottom: '1rem',
      border: '1px solid rgba(236,255,255,0.1)',
      pointerEvents: 'none',
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '2rem'
    }}>
      <div style={{ position: 'absolute', top: -2, left: -2, width: 4, height: 4, background: '#d3b166' }} />
      <div style={{ position: 'absolute', top: -2, right: -2, width: 4, height: 4, background: '#d3b166' }} />
      <div style={{ position: 'absolute', bottom: -2, left: -2, width: 4, height: 4, background: '#d3b166' }} />
      <div style={{ position: 'absolute', bottom: -2, right: -2, width: 4, height: 4, background: '#d3b166' }} />
    </div>
  )

  return (
    <>
      <AnimatePresence>
        {!hasEntered && <Preloader onEnterComplete={() => {
          initAudioContext()
          setHasEntered(true)
        }} />}
      </AnimatePresence>

      {hasEntered && (
        <>
          <QuantumBackground />
          <Navbar onNavigate={navigateToSection} />
          <AudioController />
          {siteBorderHUD}

          {/* Page transition overlay */}
          <PageTransition
            isTransitioning={isTransitioning}
            onComplete={handleTransitionMidpoint}
            onFinished={() => setIsTransitioning(false)}
            targetPage={targetLabel}
          />

          {/* All sections scrollable on one page */}
          <main style={{ position: 'relative', zIndex: 10 }}>
            <Hero onNavigate={navigateToSection} />
            <About />
            <Skills />
            <Projects />
            <Resume />
            <Contact />
          </main>

          <footer style={{
            position: 'relative', zIndex: 10,
            borderTop: '1px solid rgba(255,255,255,0.04)',
            padding: '3rem 10%',
            background: 'rgba(2,1,9,0.6)',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '5px', color: 'var(--color-secondary)' }}>
                State Machine
              </div>
              <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
                {['home','about','skills','projects','resume','contact'].map(id => (
                  <span
                    key={id}
                    onClick={() => navigateToSection(id, id.charAt(0).toUpperCase() + id.slice(1))}
                    style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                      textTransform: 'uppercase', letterSpacing: '3px',
                      color: 'var(--color-text-muted)', cursor: 'pointer',
                      transition: 'color 0.3s',
                    }}
                    onMouseOver={e => e.target.style.color = 'var(--color-secondary)'}
                    onMouseOut={e => e.target.style.color = 'var(--color-text-muted)'}
                  >{id}</span>
                ))}
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '2px', color: 'var(--color-text-muted)' }}>
                © {new Date().getFullYear()} · Engineered with precision
              </p>
            </div>
          </footer>
        </>
      )}
    </>
  )
}

export default App
