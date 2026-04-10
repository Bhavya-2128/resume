import { motion } from 'framer-motion'
import SectionHeader from '../components/SectionHeader'
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaFigma, FaPython, FaGitAlt, FaLinux } from 'react-icons/fa'
import { SiThreedotjs, SiJavascript, SiVite, SiDjango, SiOpencv, SiArduino, SiMongodb, SiPostgresql } from 'react-icons/si'

const categories = [
  {
    name: 'Frontend',
    color: '#4fc3f7',
    skills: [
      { name: 'React',      icon: <FaReact size={32} />,       color: '#61dafb', level: 90 },
      { name: 'Three.js',   icon: <SiThreedotjs size={32} />, color: '#ffffff', level: 85 },
      { name: 'JavaScript', icon: <SiJavascript size={32} />, color: '#f7df1e', level: 92 },
      { name: 'HTML5',      icon: <FaHtml5 size={32} />,       color: '#e34f26', level: 95 },
      { name: 'CSS3',       icon: <FaCss3Alt size={32} />,     color: '#1572b6', level: 88 },
      { name: 'Vite',       icon: <SiVite size={32} />,        color: '#646cff', level: 80 },
    ],
  },
  {
    name: 'Backend & Data',
    color: '#d3b166',
    skills: [
      { name: 'Python',     icon: <FaPython size={32} />,       color: '#3572A5', level: 93 },
      { name: 'Django',     icon: <SiDjango size={32} />,       color: '#092e20', level: 82 },
      { name: 'Node.js',    icon: <FaNodeJs size={32} />,       color: '#339933', level: 78 },
      { name: 'PostgreSQL', icon: <SiPostgresql size={32} />,   color: '#336791', level: 75 },
      { name: 'MongoDB',    icon: <SiMongodb size={32} />,      color: '#47a248', level: 72 },
    ],
  },
  {
    name: 'Systems & Tools',
    color: '#9b6dff',
    skills: [
      { name: 'OpenCV',  icon: <SiOpencv size={32} />,   color: '#5c3ee8', level: 80 },
      { name: 'Arduino', icon: <SiArduino size={32} />,  color: '#00979d', level: 76 },
      { name: 'Git',     icon: <FaGitAlt size={32} />,   color: '#f05032', level: 88 },
      { name: 'Linux',   icon: <FaLinux size={32} />,    color: '#fcc624', level: 74 },
      { name: 'Figma',   icon: <FaFigma size={32} />,    color: '#f24e1e', level: 70 },
    ],
  },
]

function SkillCard({ skill, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -6, boxShadow: `0 16px 40px ${skill.color}22` }}
      className="skill-card"
      style={{ color: skill.color }}
    >
      <div style={{ color: skill.color, filter: `drop-shadow(0 0 8px ${skill.color}66)` }}>
        {skill.icon}
      </div>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
        textTransform: 'uppercase', letterSpacing: '2px',
        color: 'var(--color-text-sub)',
      }}>{skill.name}</span>

      {/* Skill level bar */}
      <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 1 }}>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
          style={{
            height: '100%', borderRadius: 1,
            background: `linear-gradient(90deg, ${skill.color}88, ${skill.color})`,
            width: `${skill.level}%`,
            transformOrigin: 'left',
          }}
        />
      </div>
    </motion.div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="section-container" style={{ gap: '4rem' }}>
      <SectionHeader title="Arsenal" subtitle="Tools & Technologies" />

      {categories.map((cat, ci) => (
        <motion.div
          key={cat.name}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {/* Category label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              textTransform: 'uppercase', letterSpacing: '4px',
              color: cat.color,
            }}>{cat.name}</span>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${cat.color}33, transparent)` }} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '1rem',
          }}>
            {cat.skills.map((skill, si) => (
              <SkillCard key={skill.name} skill={skill} delay={si * 0.07} />
            ))}
          </div>
        </motion.div>
      ))}
    </section>
  )
}
