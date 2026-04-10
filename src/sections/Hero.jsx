import { motion } from 'framer-motion'

const CHAR_DELAY = 0.04

function SplitText({ text, style }) {
  return (
    <span style={style}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * CHAR_DELAY, duration: 0.5, ease: 'easeOut' }}
          style={{ display: 'inline-block', whiteSpace: ch === ' ' ? 'pre' : 'normal' }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

export default function Hero({ onNavigate }) {
  const stats = [
    { n: '3+', label: 'Years Building' },
    { n: '12+', label: 'Projects Shipped' },
    { n: '∞',  label: 'Iterations' },
  ]

  return (
    <section id="home" className="section-container" style={{ alignItems: 'center', textAlign: 'center', minHeight: '100vh', gap: '3rem' }}>

      {/* Top label bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
          textTransform: 'uppercase', letterSpacing: '4px',
          color: 'var(--color-text-muted)',
        }}
      >
        <span style={{ width: 30, height: 1, background: 'var(--color-secondary)', display: 'inline-block' }} />
        Portfolio  ·  2025
        <span style={{ width: 30, height: 1, background: 'var(--color-secondary)', display: 'inline-block' }} />
      </motion.div>

      {/* Main heading – per-character animation */}
      <div>
        <h1 className="glowing-text" style={{
          fontSize: 'clamp(3rem, 8vw, 8rem)',
          color: 'var(--color-primary)',
          textTransform: 'uppercase',
          letterSpacing: '8px',
          lineHeight: 1,
          fontWeight: 300,
        }}>
          <SplitText text="Bhavya" />
          <br />
          <SplitText
            text="Sanghavi"
            style={{ color: 'var(--color-secondary)' }}
          />
        </h1>
      </div>

      {/* Sub-role */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.8 }}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
          color: 'var(--color-text-muted)',
          maxWidth: '560px',
          letterSpacing: '1px',
          lineHeight: 1.9,
        }}
      >
        Software Engineer · Full-Stack Developer · ML Architect<br />
        <span style={{ color: 'var(--color-text-sub)', fontSize: '0.85em' }}>
          Collapsing intricate algorithms into deterministic, high-performance architectures.
        </span>
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.1, duration: 0.8 }}
        style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}
      >
        <button className="btn btn-primary" onClick={() => onNavigate && onNavigate('projects', 'Projects')}>
          View Projects
        </button>
        <button className="btn" onClick={() => onNavigate && onNavigate('contact', 'Contact')}>
          Contact Me
        </button>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ delay: 1.4, duration: 1 }}
        style={{ display: 'flex', gap: '3rem', justifyContent: 'center', flexWrap: 'wrap' }}
      >
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.4 + i * 0.15, duration: 0.5 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 300,
              color: 'var(--color-secondary)', lineHeight: 1,
            }}>{s.n}</div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              textTransform: 'uppercase', letterSpacing: '3px',
              color: 'var(--color-text-muted)', marginTop: '0.3rem',
            }}>{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 2.2 }}
        style={{
          position: 'absolute', bottom: '2.5rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
        }}
      >
        <div style={{
          width: 1, height: 50,
          background: 'linear-gradient(to bottom, transparent, var(--color-secondary))'
        }} />
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
          textTransform: 'uppercase', letterSpacing: '4px',
          color: 'var(--color-text-muted)',
        }}>Scroll</span>
      </motion.div>
    </section>
  )
}
