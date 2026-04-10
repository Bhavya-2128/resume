import { motion } from 'framer-motion'

export default function SectionHeader({ title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7 }}
      style={{ marginBottom: '4rem' }}
    >
      {/* Subtitle tag – above heading */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            textTransform: 'uppercase',
            letterSpacing: '5px',
            color: 'var(--color-secondary)',
            marginBottom: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
          }}
        >
          <span style={{ width: 24, height: 1, background: 'var(--color-secondary)', display: 'inline-block' }} />
          {subtitle}
        </motion.p>
      )}

      {/* Main heading */}
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
          color: 'var(--color-primary)',
          textTransform: 'uppercase',
          letterSpacing: '6px',
          fontWeight: 300,
          lineHeight: 1.05,
          textShadow: '0 0 30px rgba(236,255,255,0.12)',
          margin: 0,
        }}
      >
        {title}
      </motion.h2>

      {/* Decorative underline */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          marginTop: '1rem',
          height: 1,
          width: 80,
          background: 'linear-gradient(90deg, var(--color-secondary), transparent)',
          transformOrigin: 'left',
        }}
      />
    </motion.div>
  )
}
