import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeader from '../components/SectionHeader'
import QuantumThunderPopup from '../components/QuantumThunderPopup'

const socials = [
  { label: 'GitHub',   href: 'https://github.com/Bhavya-2128',                        icon: '⌥' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/bhavyakumar-sanghavi-947ab2375?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',       icon: '⊕' },
  { label: 'Instagram', href: 'https://instagram.com/bhavya_21287',                   icon: '◒' },
  { label: 'Email',    href: 'mailto:bhavya23482007@gmail.com',                        icon: '⌘' },
]

export default function Contact() {
  const [isSending, setIsSending]   = useState(false)
  const [status, setStatus]         = useState('idle')
  const [focusedField, setFocused]  = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSending(true)
    const formData = new FormData(e.target)
    try {
      const res = await fetch('https://formsubmit.co/ajax/bhavya23482007@gmail.com', {
        method: 'POST', body: formData, headers: { Accept: 'application/json' },
      })
      if (res.ok) { setStatus('success'); e.target.reset(); setTimeout(() => setStatus('idle'), 5000) }
      else alert('Failed to execute transfer. Interference detected.')
    } catch { alert('Network interference interrupted the transmission.') }
    finally  { setIsSending(false) }
  }

  const inputStyle = (name) => ({
    background: focusedField === name ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)',
    border: '1px solid',
    borderColor: focusedField === name ? 'rgba(211,177,102,0.5)' : 'rgba(255,255,255,0.06)',
    borderBottom: `1px solid ${focusedField === name ? 'rgba(211,177,102,0.7)' : 'rgba(211,177,102,0.2)'}`,
    padding: '1rem 1.2rem',
    color: 'var(--color-text)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    outline: 'none',
    borderRadius: '3px',
    width: '100%',
    transition: 'all 0.35s ease',
    boxShadow: focusedField === name ? '0 4px 20px rgba(211,177,102,0.08), inset 0 -1px 0 rgba(211,177,102,0.25)' : 'none',
  })

  return (
    <section id="contact" className="section-container" style={{ minHeight: '90vh', gap: '4rem' }}>
      <SectionHeader title="Entanglement" subtitle="Initialize Communication Protocol" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '4rem', alignItems: 'start' }}>

        {/* Left – contact info */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
        >
          <div>
            <h3 style={{
              fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 300,
              color: 'var(--color-primary)', marginBottom: '1rem',
            }}>
              Let's build something extraordinary
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.9 }}>
              Currently open to full-time roles, freelance projects, and research collaborations.
              Transmit your data payload below — I respond within 24 hours.
            </p>
          </div>

          {/* Social links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {socials.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem 1.2rem',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.01)',
                  color: 'var(--color-text-sub)',
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  letterSpacing: '1px',
                  transition: 'all 0.35s ease',
                }}
                whileHover={{
                  borderColor: 'rgba(211,177,102,0.3)',
                  background: 'rgba(211,177,102,0.04)',
                  color: 'var(--color-secondary)',
                  x: 4,
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-secondary)', fontSize: '1.1rem' }}>
                  {s.icon}
                </span>
                {s.label}
                <span style={{ marginLeft: 'auto', fontSize: '0.8em', opacity: 0.4 }}>→</span>
              </motion.a>
            ))}
          </div>

          {/* QR Code */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginTop: '0.5rem', background: 'rgba(255,255,255,0.01)', padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: '4px' }}
          >
            <div style={{
              width: '80px', height: '80px', borderRadius: '4px', overflow: 'hidden',
              border: '1px solid rgba(211,177,102,0.3)', boxShadow: '0 0 15px rgba(211,177,102,0.1)'
            }}>
              <img
                src="/bhavya_21287_qr.png"
                alt="Instagram QR"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
               <span style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Connect</span>
               <span style={{ color: 'var(--color-text-sub)', fontSize: '0.85rem', lineHeight: 1.5 }}>Scan QR to connect<br/>on Instagram instantly.</span>
            </div>
          </motion.div>

          {/* Location ping */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.7rem',
            fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
            textTransform: 'uppercase', letterSpacing: '3px',
            color: 'var(--color-text-muted)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 8px #4ade80' }} />
            Available · India (IST UTC+5:30)
          </div>
        </motion.div>

        {/* Right – form */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <form
            onSubmit={handleSubmit}
            className="glass-panel"
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            <input type="text"   name="_honey"    style={{ display: 'none' }} />
            <input type="hidden" name="_captcha"  value="false" />
            <input type="hidden" name="_subject"  value="New Transmission from Quantum Portfolio!" />

            {[
              { id: 'name',    label: 'Terminal Node — Name',          type: 'text',  placeholder: 'Enter node alias...',     required: true },
              { id: 'email',   label: 'Photon Stream — Email',         type: 'email', placeholder: 'Enter relay address...',  required: true },
            ].map(field => (
              <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                  textTransform: 'uppercase', letterSpacing: '3px',
                  color: focusedField === field.id ? 'var(--color-secondary)' : 'var(--color-text-muted)',
                  transition: 'color 0.3s',
                }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.id}
                  required={field.required}
                  placeholder={field.placeholder}
                  style={inputStyle(field.id)}
                  onFocus={() => setFocused(field.id)}
                  onBlur={() => setFocused(null)}
                />
              </div>
            ))}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                textTransform: 'uppercase', letterSpacing: '3px',
                color: focusedField === 'message' ? 'var(--color-secondary)' : 'var(--color-text-muted)',
                transition: 'color 0.3s',
              }}>
                Data Payload — Message
              </label>
              <textarea
                name="message"
                rows="5"
                required
                placeholder="Enter byte sequence..."
                style={{ ...inputStyle('message'), resize: 'vertical', fontFamily: 'var(--font-body)' }}
                onFocus={() => setFocused('message')}
                onBlur={() => setFocused(null)}
              />
            </div>

            <motion.button
              type="submit"
              disabled={isSending}
              className="btn btn-primary"
              whileHover={{ scale: 1.02, boxShadow: 'var(--glow-gold)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                marginTop: '0.5rem', alignSelf: 'flex-start',
                opacity: isSending ? 0.7 : 1,
                fontSize: '0.82rem', padding: '1rem 2.8rem',
              }}
            >
              {isSending ? '⟳  Transmitting Array...' : 'Execute Transfer →'}
            </motion.button>
          </form>
        </motion.div>
      </div>

      <AnimatePresence>
        {status === 'success' && (
          <QuantumThunderPopup onComplete={() => setStatus('idle')} />
        )}
      </AnimatePresence>
    </section>
  )
}
