import { motion } from 'framer-motion'
import SectionHeader from '../components/SectionHeader'

const timeline = [
  { year: '2025', label: 'Full-Stack & ML Systems', desc: 'Building end-to-end applications with embedded ML pipelines and real-time data processing.' },
  { year: '2024', label: 'Machine Learning Research', desc: 'Implemented custom ML algorithms including XGBoost from scratch, improving training speed by 25%.' },
  { year: '2023', label: 'Systems Engineering', desc: 'Designed gesture-controlled robotics systems using OpenCV and Arduino for real-time object tracking.' },
  { year: '2022', label: 'Foundation', desc: 'Deep dived into data structures, algorithms, and full-stack web development with Python and Django.' },
]

export default function About() {
  return (
    <section id="about" className="section-container" style={{ gap: '5rem' }}>
      <SectionHeader title="About Me" subtitle="Origin Story" />

      {/* Bio + Photo grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>

        {/* Left – text */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
          <div className="glass-panel" style={{ borderLeft: '2px solid var(--color-secondary)' }}>
            <h3 style={{ color: 'var(--color-secondary)', fontSize: '1.8rem', fontWeight: 300, marginBottom: '1.2rem', letterSpacing: '2px' }}>
              State Machine
            </h3>
            <p style={{ marginBottom: '1.2rem', fontSize: '1rem', color: 'var(--color-text-sub)', lineHeight: 1.9 }}>
              I am a Software Engineer operating at the nexus of theoretical physics and high-performance computing. By conceptualizing complex software architectures as quantum superpositions, I collapse intricate algorithms and raw data models into deterministic, highly-optimized system architectures.
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-sub)', lineHeight: 1.9 }}>
              My methodology revolves around precision technical engineering, rigorous algorithmic analysis, and deploying full-stack infrastructure — from training ML models to structuring automated hardware pipelines.
            </p>
          </div>

          {/* Quick-stat row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', border: '1px solid var(--glass-border)' }}>
            {[
              { n: 'B.Tech', label: 'Computer Science' },
              { n: 'India', label: 'Based In' },
              { n: 'Open', label: 'To Work' },
            ].map(s => (
              <div key={s.label} className="stat-cell" style={{ textAlign: 'center' }}>
                <span className="stat-number" style={{ fontSize: '1.3rem', letterSpacing: '1px' }}>{s.n}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right – photo */}
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}
        >
          {/* Decorative corner lines */}
          <div style={{
            position: 'absolute', inset: -16,
            border: '1px solid rgba(211,177,102,0.12)',
            borderRadius: 8,
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: -8, left: -8, right: -8, bottom: -8,
            border: '1px solid rgba(211,177,102,0.06)',
            borderRadius: 10,
            pointerEvents: 'none',
          }} />

          <div style={{
            width: '100%', maxWidth: '380px', aspectRatio: '3/4',
            borderRadius: '6px',
            background: 'linear-gradient(155deg, rgba(211,177,102,0.15), rgba(0,0,0,0.8))',
            padding: '2px',
            boxShadow: 'var(--glow-gold)',
            overflow: 'hidden',
          }}>
            <img
              src="/profile.png"
              alt="Bhavya Sanghavi"
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover', borderRadius: '4px',
                filter: 'contrast(1.05) saturate(0.9)',
              }}
              onError={e => {
                // Fallback if no profile image
                e.target.style.display = 'none'
                e.target.parentElement.style.background = 'linear-gradient(155deg,rgba(211,177,102,0.2),rgba(0,0,50,0.9))'
                e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:var(--font-heading);font-size:5rem;font-weight: 200;color:rgba(211,177,102,0.4)">BS</div>`
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
          textTransform: 'uppercase', letterSpacing: '4px',
          color: 'var(--color-text-muted)', marginBottom: '2rem',
        }}>
          — Timeline
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderLeft: '1px solid rgba(211,177,102,0.15)', paddingLeft: '2rem' }}>
          {timeline.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '2rem', paddingBottom: '2rem', position: 'relative' }}
            >
              {/* Dot on timeline */}
              <div style={{
                position: 'absolute', left: '-2.55rem', top: '0.3rem',
                width: 8, height: 8, borderRadius: '50%',
                background: i === 0 ? 'var(--color-secondary)' : 'rgba(211,177,102,0.25)',
                boxShadow: i === 0 ? '0 0 12px rgba(211,177,102,0.5)' : 'none',
              }} />
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                color: 'var(--color-secondary)', paddingTop: '0.2rem',
              }}>
                {item.year}
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-heading)', fontSize: '1rem',
                  color: 'var(--color-primary)', marginBottom: '0.4rem', fontWeight: 300,
                }}>{item.label}</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                  {item.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
