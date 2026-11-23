import { experience } from '../../data/experience'
import Section from '../Section'
import SectionTitle from '../SectionTitle'

// Renders ONLY if src/data/experience.ts has at least one item.
export default function Experience() {
  if (experience.length === 0) return null
  return (
    <Section id="experience" labelledBy="experience-title">
      <SectionTitle id="experience-title" eyebrow="Where I have worked" title="Experience" />
      <ol className="mx-auto max-w-3xl space-y-6">
        {experience.map((item) => (
          <li key={`${item.role}-${item.organization}`} className="card p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.role}</h3>
            <p className="text-sm font-medium text-accent-600 dark:text-accent-400">
              {item.organization} | {item.period}
            </p>
            <p className="mt-3 text-slate-600 dark:text-slate-400">{item.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
