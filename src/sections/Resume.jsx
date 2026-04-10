import { motion } from 'framer-motion'
import SectionHeader from '../components/SectionHeader'

const highlights = [
  { icon: '⬡', title: 'Full-Stack Architecture', desc: 'React · Django · REST · PostgreSQL' },
  { icon: '⬡', title: 'Machine Learning', desc: 'XGBoost · OpenCV · Data Pipelines' },
  { icon: '⬡', title: 'Systems Engineering', desc: 'Arduino · Real-time Control · C++' },
  { icon: '⬡', title: 'Tools & Workflow', desc: 'Git · Linux · Figma · Agile' },
]

export default function Resume() {
  return (
    <section id="resume" className="section-container" style={{ alignItems: 'center', gap: '4rem' }}>
      <SectionHeader title="Blueprints" subtitle="Quantum Engineering Data Core" />

      {/* Capability grid */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1px',
          border: '1px solid var(--glass-border)',
          width: '100%', maxWidth: '900px',
        }}
      >
        {highlights.map((h, i) => (
          <motion.div
            key={h.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            style={{
              padding: '2rem',
              background: 'rgba(255,255,255,0.01)',
              borderRight: '1px solid var(--glass-border)',
              transition: 'background 0.3s',
            }}
            whileHover={{ background: 'rgba(211,177,102,0.04)' }}
          >
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '1.2rem',
              color: 'var(--color-secondary)', marginBottom: '0.8rem',
            }}>{h.icon}</div>
            <div style={{
              fontFamily: 'var(--font-heading)', fontSize: '0.95rem',
              color: 'var(--color-primary)', marginBottom: '0.5rem', fontWeight: 300,
            }}>{h.title}</div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
              color: 'var(--color-text-muted)', letterSpacing: '1px',
            }}>{h.desc}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Download panel */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="glass-panel"
        style={{
          textAlign: 'center', maxWidth: '580px', width: '100%',
          position: 'relative', overflow: 'visible',
        }}
      >
        {/* Decorative pulse ring */}
        <div className="pulse-ring" style={{ borderColor: 'rgba(211,177,102,0.12)' }} />

        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
          textTransform: 'uppercase', letterSpacing: '4px',
          color: 'var(--color-secondary)', marginBottom: '1rem',
        }}>
          ── Engineering Data Core ──
        </p>
        <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
          My comprehensive software engineering background, full-stack proficiencies, and operational machine learning analytics are structured within my professional data core.
        </p>

        <motion.a
          href="Bhavyakumar_Sanghavi_Resume.pdf"
          download="Bhavyakumar_Sanghavi_Resume.pdf"
          className="btn btn-primary"
          style={{ fontSize: '0.9rem', padding: '1.1rem 3.5rem', letterSpacing: '4px' }}
          whileHover={{ scale: 1.04, boxShadow: 'var(--glow-gold)' }}
          whileTap={{ scale: 0.97 }}
        >
          ↓ Download Blueprint
        </motion.a>
      </motion.div>
    </section>
  )
}
