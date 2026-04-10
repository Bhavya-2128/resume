import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'projects' },
  { label: 'Resume', id: 'resume' },
  { label: 'Contact', id: 'contact' },
]

export default function Navbar({ onNavigate }) {
  const [activeSection, setActiveSection] = useState('home')

  // Track which section is in view while scrolling
  useEffect(() => {
    const sectionIds = navLinks.map(l => l.id)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleClick = (id, label) => {
    if (onNavigate) {
      onNavigate(id, label)
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Logo */}
      <div
        onClick={() => handleClick('home', 'Home')}
        style={{
          position: 'fixed',
          top: '2rem',
          left: '2rem',
          zIndex: 50,
          fontFamily: 'var(--font-heading)',
          fontSize: '1.2rem',
          textTransform: 'uppercase',
          letterSpacing: '5px',
          fontWeight: 'bold',
          color: '#d3b166',
          cursor: 'pointer',
        }}
      >
        State Machine
      </div>

      {/* Navigation Links */}
      <div style={{
        position: 'fixed',
        top: '2rem',
        right: '2rem',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.8rem',
      }}>
        {navLinks.map((link) => {
          const isActive = activeSection === link.id
          return (
            <div
              key={link.id}
              onClick={() => handleClick(link.id, link.label)}
              style={{
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)',
                textTransform: 'uppercase',
                fontSize: '0.65rem',
                letterSpacing: isActive ? '6px' : '4px',
                fontWeight: isActive ? 500 : 300,
                color: isActive ? 'var(--color-secondary)' : 'var(--color-primary)',
                transition: 'all 0.4s ease',
                position: 'relative',
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.target.style.color = 'var(--color-secondary)'
                  e.target.style.letterSpacing = '6px'
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.target.style.color = 'var(--color-primary)'
                  e.target.style.letterSpacing = '4px'
                }
              }}
            >
              {link.label}
              {isActive && (
                <motion.div
                  layoutId="nav-dot"
                  style={{
                    position: 'absolute',
                    right: '-12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: '#d3b166',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </div>
          )
        })}
      </div>
    </motion.nav>
  )
}
