import { certifications } from '../../data/certifications'
import { ExternalIcon } from '../../assets/icons'
import Section from '../Section'
import SectionTitle from '../SectionTitle'

// Renders ONLY if src/data/certifications.ts has at least one item.
export default function Certifications() {
  if (certifications.length === 0) return null
  return (
    <Section id="certifications" labelledBy="certifications-title">
      <SectionTitle id="certifications-title" eyebrow="Learning" title="Certifications" />
      <ul className="grid gap-6 sm:grid-cols-2">
        {certifications.map((c) => (
          <li key={`${c.title}-${c.issuer}`} className="card p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{c.title}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {c.issuer} | {c.date}
            </p>
            {c.url && (
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600 hover:underline dark:text-accent-400"
              >
                View credential <ExternalIcon width={14} height={14} />
              </a>
            )}
          </li>
        ))}
      </ul>
    </Section>
  )
}
