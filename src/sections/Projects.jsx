import { motion } from 'framer-motion'
import SectionHeader from '../components/SectionHeader'

const projects = [
  {
    id: '01',
    title: 'Gesture Controlled Robot Arm',
    tagline: 'Real-time hardware meets computer vision',
    description: 'Real-time object detection and tracking pipeline using OpenCV and Arduino. Translates hand gestures detected via webcam into servo motor commands with sub-100ms latency.',
    tech: ['OpenCV', 'Arduino', 'Python', 'C++', 'Computer Vision'],
    color: '#4fc3f7',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    github: 'https://github.com/Bhavya-2128',
    metrics: [{ n: '<100ms', l: 'Latency' }, { n: '94%', l: 'Accuracy' }],
  },
  {
    id: '02',
    title: 'Job Portal Web Application',
    tagline: 'Full-stack CRUD platform with REST API',
    description: 'End-to-end job marketplace built with Django and Django Rest Framework. Supports employer postings, applicant profiles, and a recommendation layer with full authentication.',
    tech: ['Django', 'Python', 'REST API', 'PostgreSQL', 'Full-Stack'],
    color: '#d3b166',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    github: 'https://github.com/Bhavya-2128',
    metrics: [{ n: 'REST', l: 'API Design' }, { n: 'CRUD', l: 'Full Access' }],
  },
  {
    id: '03',
    title: 'XGBoost From Scratch',
    tagline: 'ML algorithm re-engineered for speed',
    description: 'Custom implementation of the XGBoost gradient-boosting algorithm. Achieved a 25% improvement in training speed over the reference standard through optimized tree-building and memory layout.',
    tech: ['Python', 'NumPy', 'Machine Learning', 'Algorithms', 'Data Science'],
    color: '#9b6dff',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    github: 'https://github.com/Bhavya-2128',
    metrics: [{ n: '+25%', l: 'Faster Training' }, { n: '0→1', l: 'Built from Scratch' }],
  },
]

function ProjectCard({ project, index }) {
  const isEven = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3rem',
        alignItems: 'center',
        direction: isEven ? 'ltr' : 'rtl',
      }}
    >
      {/* Image panel */}
      <div style={{ direction: 'ltr', position: 'relative', overflow: 'hidden', borderRadius: 6 }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: `linear-gradient(135deg, ${project.color}22 0%, transparent 60%)`,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 1, background: project.color, opacity: 0.5, zIndex: 3,
        }} />
        <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.6 }}>
          <img
            src={project.image}
            alt={project.title}
            style={{
              width: '100%', height: '280px', objectFit: 'cover',
              display: 'block', filter: 'grayscale(15%) contrast(1.05)',
            }}
          />
        </motion.div>
        {/* Project number overlay */}
        <div style={{
          position: 'absolute', bottom: '1rem', right: '1rem', zIndex: 3,
          fontFamily: 'var(--font-heading)', fontSize: '4rem', fontWeight: 200,
          color: `${project.color}22`, lineHeight: 1, userSelect: 'none',
        }}>
          {project.id}
        </div>
      </div>

      {/* Text panel */}
      <div style={{ direction: 'ltr', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Header */}
        <div>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            textTransform: 'uppercase', letterSpacing: '4px',
            color: project.color, marginBottom: '0.5rem',
          }}>
            {project.tagline}
          </p>
          <h3 style={{
            fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 300,
            color: 'var(--color-primary)', lineHeight: 1.2, margin: 0,
          }}>
            {project.title}
          </h3>
        </div>

        <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
          {project.description}
        </p>

        {/* Metrics */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          {project.metrics.map(m => (
            <div key={m.l} style={{
              padding: '0.8rem 1.2rem', border: `1px solid ${project.color}33`,
              background: `${project.color}08`, borderRadius: 4, textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 300,
                color: project.color,
              }}>{m.n}</div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                textTransform: 'uppercase', letterSpacing: '2px',
                color: 'var(--color-text-muted)',
              }}>{m.l}</div>
            </div>
          ))}
        </div>

        {/* Tech badges */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {project.tech.map(t => (
            <span key={t} className="tech-badge">{t}</span>
          ))}
        </div>

        {/* CTA */}
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
          style={{ alignSelf: 'flex-start', borderColor: `${project.color}55`, color: project.color }}
        >
          View on GitHub →
        </a>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="section-container" style={{ gap: '6rem' }}>
      <SectionHeader title="Missions" subtitle="Featured Projects" />

      {projects.map((project, i) => (
        <ProjectCard key={project.id} project={project} index={i} />
      ))}
    </section>
  )
}
